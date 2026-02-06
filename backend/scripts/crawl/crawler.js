const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

// Import Models (Đảm bảo đường dẫn đúng với cấu trúc thư mục của bạn)
const Category = require('../../src/models/category.model');
const Product = require('../../src/models/product.model');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// --- CẤU HÌNH ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/e-commerce';

// DANH SÁCH URL CẦN CRAWL ĐÃ ĐƯỢC CẬP NHẬT
const TARGET_URLS = [
    { name: 'Áo khoác', url: 'https://canifa.com/nam/ao-khoac-giu-nhiet' },
    { name: 'Áo nỉ', url: 'https://canifa.com/nam/quan-ao-ni' },
    { name: 'Áo len', url: 'https://canifa.com/nam/ao-len' },
    { name: 'Áo polo', url: 'https://canifa.com/nam/ao-polo' },
    { name: 'Áo phông', url: 'https://canifa.com/nam/ao-phong' },
    { name: 'Quần', url: 'https://canifa.com/nam/quan' } // Đã đổi tên từ 'Quần dài' -> 'Quần' cho khớp URL
];

// Số lượng cần lấy mỗi danh mục để tổng ~100 sp (17 * 6 = 102)
const LIMIT_PER_CAT = 17;

// --- HÀM HỖ TRỢ ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Hàm cuộn trang để load ảnh và sản phẩm (Lazy load)
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                // Scroll khoảng 60% trang là đủ lấy số lượng cần thiết
                if (totalHeight >= scrollHeight * 0.6) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

// Hàm đảm bảo Category tồn tại trong DB và trả về _id
async function getOrCreateCategory(name, url) {
    let category = await Category.findOne({ name: name });

    if (!category) {
        console.log(`⚠️ Danh mục "${name}" chưa có. Đang tạo mới...`);
        category = await Category.create({
            name: name,
            description: `Sản phẩm thời trang ${name} từ Canifa`,
            imageUrl: 'https://canifa.com/assets/images/logo.svg' // Ảnh placeholder
        });
        console.log(`✅ Đã tạo danh mục: ${name}`);
    } else {
        console.log(`ℹ️ Tìm thấy danh mục: ${name}`);
    }
    return category._id;
}

// --- LOGIC CHÍNH ---
(async () => {
    // 1. Kết nối Database
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🔌 Đã kết nối MongoDB thành công!');
    } catch (err) {
        console.error('❌ Lỗi kết nối DB:', err);
        process.exit(1);
    }

    // 2. Khởi tạo Browser
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    // 3. Duyệt qua từng danh mục
    for (const target of TARGET_URLS) {
        try {
            // Lấy ID Category từ DB
            const categoryId = await getOrCreateCategory(target.name, target.url);

            console.log(`\n🌐 Đang truy cập: ${target.url}`);
            await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Cuộn trang để load sản phẩm
            await autoScroll(page);
            await sleep(2000);

            // Lấy link sản phẩm
            const productLinks = await page.evaluate(() => {
                // Selector chính xác dựa trên debug_layout.html
                const items = document.querySelectorAll('.product-item a.product-item__image');
                return Array.from(items)
                    .map(i => i.getAttribute('href')) // Lấy href gốc (có thể tương đối)
                    .filter(h => h)
                    .map(h => h.startsWith('http') ? h : `https://canifa.com${h}`); // Xử lý link tương đối
            });

            if (productLinks.length === 0) {
                console.log(`   ⚠️ Không tìm thấy sản phẩm nào. Đang lưu HTML để debug...`);
                const html = await page.content();
                const fs = require('fs');
                fs.writeFileSync('debug_layout.html', html);
                console.log('   📄 Đã lưu debug_layout.html');
            }

            // Lọc số lượng link cần crawl
            const linksToCrawl = productLinks.slice(0, LIMIT_PER_CAT);
            console.log(`   -> Tìm thấy ${linksToCrawl.length} sản phẩm cần xử lý cho danh mục ${target.name}.`);

            // Vào từng trang chi tiết
            for (const link of linksToCrawl) {
                try {
                    await page.goto(link, { waitUntil: 'domcontentloaded' });

                    // Cào dữ liệu chi tiết
                    const rawData = await page.evaluate(async () => {
                        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
                        // Đợi hydration (chờ skeleton biến mất hoặc nội dung xuất hiện)
                        let retries = 20;
                        while (retries > 0) {
                            const skeleton = document.querySelector('.skeleton');
                            const nameEl = document.querySelector('.product__name-sku');
                            if (!skeleton && nameEl && nameEl.innerText.trim()) break;
                            await sleep(500);
                            retries--;
                        }

                        const getText = (s) => document.querySelector(s)?.innerText?.trim() || '';
                        const parsePrice = (s) => s ? parseInt(s.replace(/[^\d]/g, '')) : 0;

                        // Selectors chi tiết (Cập nhật từ debug_detail.html)
                        let name = getText('.product__name-sku') || getText('h1.page-title') || document.title;
                        // Làm sạch tên (loại bỏ SKU, Copy, Chia sẻ,...)
                        name = name.split('SKU:')[0].split('Mã:')[0].replace(/Copy Chia sẻ.*/, '').trim();

                        // Giá
                        let price = 0;
                        let oldPrice = 0;

                        // Nếu box giá chứa nhiều giá
                        if (document.querySelector('.product__price-box')) {
                            const box = document.querySelector('.product__price-box');
                            const special = box.querySelector('.special-price .price');
                            const old = box.querySelector('.old-price .price');
                            if (special) {
                                price = parsePrice(special.innerText);
                                if (old) oldPrice = parsePrice(old.innerText);
                            } else {
                                price = parsePrice(box.innerText);
                            }
                        } else {
                            const priceEl = document.querySelector('.product-item__price--regular') ||
                                document.querySelector('.product-price .price') ||
                                document.querySelector('.price-box .price');
                            if (priceEl) price = parsePrice(priceEl.innerText);
                        }

                        const description = getText('.product-description') || getText('.description') || name;

                        // Ảnh
                        let imgs = Array.from(document.querySelectorAll('.product__media img, .gallery-placeholder img'))
                            .map(img => img.src || img.dataset.src)
                            .filter(src => src && !src.includes('placeholder'));

                        if (imgs.length === 0) {
                            // Thử lấy từ __NUXT__ data nếu có (Hack)
                            if (window.__NUXT__ && window.__NUXT__.fetch && window.__NUXT__.fetch['ProductPage:0']) {
                                try {
                                    const p = window.__NUXT__.fetch['ProductPage:0'].product;
                                    if (p && p.media_gallery) {
                                        imgs = p.media_gallery.map(m => m.image);
                                    }
                                } catch (e) { }
                            }
                        }

                        return {
                            name,
                            description,
                            price,
                            oldPrice,
                            images: [...new Set(imgs)],
                            tags: ['new']
                        };
                    });

                    // Kiểm tra dữ liệu hợp lệ
                    if (!rawData.name || !rawData.price) {
                        console.log(`   ⚠️ Bỏ qua (thiếu tên/giá): ${link}`);
                        // Debug: Lưu HTML chi tiết
                        const html = await page.content();
                        const fs = require('fs');
                        fs.writeFileSync('debug_detail.html', html);
                        console.log('   📄 Đã lưu debug_detail.html');
                        continue;
                    }

                    // Chuẩn bị object cập nhật
                    const productData = {
                        name: rawData.name,
                        description: rawData.description,
                        price: rawData.price,
                        oldPrice: rawData.oldPrice,
                        stock: Math.floor(Math.random() * 100) + 10,
                        category: categoryId,
                        imageUrl: rawData.images[0] || 'https://via.placeholder.com/300',
                        images: rawData.images,
                        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                        reviewCount: Math.floor(Math.random() * 50),
                        tags: rawData.tags
                    };

                    // Upsert (Tìm theo name, nếu có thì update, chưa có thì insert)
                    await Product.findOneAndUpdate(
                        { name: rawData.name },
                        productData,
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    );

                    console.log(`   💾 Đã lưu/cập nhật: ${rawData.name} - ${rawData.price}đ`);

                    await sleep(500); // Nghỉ nhẹ giữa các request

                } catch (pErr) {
                    console.error(`   ❌ Lỗi sp ${link}: ${pErr.message}`);
                }
            }
        } catch (catErr) {
            console.error(`❌ Lỗi danh mục ${target.name}: ${catErr.message}`);
        }
    }

    console.log('\n🎉 HOÀN THÀNH CRAWL DATA!');
    await browser.close();
    await mongoose.connection.close();
})();