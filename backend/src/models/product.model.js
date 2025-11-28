const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        oldPrice: { // Dùng để hiển thị giá gạch ngang (sale)
            type: Number,
            min: [0, 'Old price cannot be negative'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required'],
            index: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        images: [String], // Cho gallery ảnh (trang chi tiết)
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        tags: {
            type: [String], // Dùng để lọc: 'flash-sale', 'best-selling'
            index: true,
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

// Tạo text index để tìm kiếm
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
