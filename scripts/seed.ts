import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI || ''
if (!MONGODB_URI) { console.error('❌ MONGODB_URI tidak ditemukan di .env.local'); process.exit(1) }

// — Schemas —
const SettingsSchema = new mongoose.Schema({ siteTitle: String, description: String, whatsappNumber: String, heroImage: String, logo: String, address: String, operationalHours: String })
const CategorySchema = new mongoose.Schema({ name: { type: String, required: true } })
const ProductSchema = new mongoose.Schema({ name: String, price: Number, description: String, image: String, categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, featured: Boolean }, { timestamps: true })
const TestimonialSchema = new mongoose.Schema({ name: String, message: String, image: String, rating: Number }, { timestamps: true })
const AdminSchema = new mongoose.Schema({ email: String, password: String })

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema)
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

async function seed() {
  console.log('🔌 Menghubungkan ke MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Terhubung!\n')

  // Hapus data lama (uncomment jika ingin reset penuh)
  // await Promise.all([Settings.deleteMany(), Category.deleteMany(), Product.deleteMany(), Testimonial.deleteMany(), Admin.deleteMany()])
  // console.log('🗑️  Data lama dihapus\n')

  // 1. Settings
  const existingSettings = await Settings.findOne()
  if (!existingSettings) {
    await Settings.create({
      siteTitle: 'Toko Kita',
      whatsappNumber: '6281234567890',
      description: 'Produk terbaik pilihan kami, berkualitas tinggi dengan harga terjangkau untuk semua kalangan.',
      address: 'Jl. Contoh No. 1, Jakarta Selatan 12345',
      operationalHours: 'Senin–Sabtu, 08.00–17.00 WIB',
      heroImage: '',
      logo: '',
    })
    console.log('⚙️  Settings default dibuat')
  } else {
    console.log('⚙️  Settings sudah ada, dilewati')
  }

  // 2. Kategori
  const existingCats = await Category.countDocuments()
  let categories: any[] = []
  if (existingCats === 0) {
    categories = await Category.insertMany([
      { name: 'Makanan' },
      { name: 'Minuman' },
      { name: 'Aksesoris' },
    ])
    console.log('🏷️  3 kategori dibuat:', categories.map((c: any) => c.name).join(', '))
  } else {
    categories = await Category.find()
    console.log('🏷️  Kategori sudah ada, dilewati')
  }

  const catByName = Object.fromEntries(categories.map((c: any) => [c.name, c._id]))

  // 3. Produk
  const existingProds = await Product.countDocuments()
  if (existingProds === 0) {
    await Product.insertMany([
      { name: 'Kue Brownies Cokelat', price: 45000, description: 'Brownies lembut dengan cokelat premium. Cocok untuk camilan keluarga atau hadiah.', categoryId: catByName['Makanan'], featured: true },
      { name: 'Cookies Oatmeal Raisin', price: 35000, description: 'Cookies renyah dengan campuran oatmeal dan kismis pilihan. Lezat dan bergizi.', categoryId: catByName['Makanan'], featured: true },
      { name: 'Es Teh Poci Jasmine', price: 15000, description: 'Teh melati segar diseduh dengan cara tradisional, disajikan dengan es batu pilihan.', categoryId: catByName['Minuman'], featured: true },
      { name: 'Jus Alpukat Premium', price: 25000, description: 'Jus alpukat creamy dengan alpukat pilihan. Tanpa pengawet, segar setiap hari.', categoryId: catByName['Minuman'], featured: false },
      { name: 'Gelang Manik Handmade', price: 55000, description: 'Gelang cantik buatan tangan dari manik-manik berkualitas. Tersedia berbagai warna.', categoryId: catByName['Aksesoris'], featured: true },
      { name: 'Kalung Batu Alam', price: 85000, description: 'Kalung elegan dari batu alam pilihan. Cocok untuk tampilan kasual maupun formal.', categoryId: catByName['Aksesoris'], featured: false },
    ])
    console.log('📦 6 produk contoh dibuat')
  } else {
    console.log('📦 Produk sudah ada, dilewati')
  }

  // 4. Testimoni
  const existingTests = await Testimonial.countDocuments()
  if (existingTests === 0) {
    await Testimonial.insertMany([
      { name: 'Siti Rahayu', message: 'Produknya enak banget! Browniesnya lembut dan cokelatnya terasa. Packing rapi, pengiriman cepat. Pasti beli lagi!', rating: 5 },
      { name: 'Budi Santoso', message: 'Sudah belanja berkali-kali, kualitas selalu konsisten. Harga juga sangat terjangkau untuk kualitas seperti ini. Recommended!', rating: 5 },
      { name: 'Dewi Lestari', message: 'Gelangnya cantik banget, persis seperti di foto. Maniknya berkualitas dan tidak mudah lepas. Sudah belikan untuk semua teman!', rating: 4 },
      { name: 'Andi Firmansyah', message: 'Pelayanannya ramah dan responsif. Barang datang dalam kondisi sempurna. Toko terpercaya, akan selalu jadi langganan saya.', rating: 5 },
    ])
    console.log('💬 4 testimoni contoh dibuat')
  } else {
    console.log('💬 Testimoni sudah ada, dilewati')
  }

  // 5. Admin default
  const existingAdmin = await Admin.findOne({ email: 'admin@toko.com' })
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await Admin.create({ email: 'admin@toko.com', password: hashedPassword })
    console.log('👤 Admin default dibuat: admin@toko.com / admin123')
  } else {
    console.log('👤 Admin sudah ada, dilewati')
  }

  console.log('\n✅ Seed selesai!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🌐 Jalankan: npm run dev')
  console.log('🔑 Login admin: admin@toko.com / admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed error:', err)
  process.exit(1)
})
