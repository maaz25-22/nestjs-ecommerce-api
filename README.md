# NestJS E-Commerce API

A modern e-commerce API built with NestJS, TypeORM, GraphQL, Kafka, JWT, and TypeScript.

<p align="center">
  <img src="./assets/project.png" width="350" height="350" />
</p>


## 🚀 Features

- **NestJS Framework** - Modern Node.js framework
- **TypeORM** - SQL database with ORM
- **GraphQL** - Apollo Server GraphQL API
- **JWT Authentication** - Secure authentication
- **Role-based Authorization** - Role-based access control
- **Email Verification** - Email verification system
- **Kafka Integration** - Message queue integration
- **Class Validator** - Data validation
- **TypeScript** - Type safety

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Kafka (optional)

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Bes-js/nestjs-ecommerce-api
cd nestjs-ecommerce-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Configure your environment variables in `.env`:**
```env
# Application
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=yourSuperSecretJwtKeyChangeThisInProduction

# Database
DB_TYPE=sqlite
DB_DATABASE=database.sqlite

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ecommerce.com
FRONTEND_URL=http://localhost:3000

# Kafka (Optional)
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=ecommerce-api
KAFKA_GROUP_ID=ecommerce-group
KAFKAJS_NO_PARTITIONER_WARNING=1
```

5. **Start the application:**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🗄️ Database

SQLite database is automatically created. Database file: `database.sqlite`

## 📊 GraphQL Playground

After starting the application, access GraphQL Playground:
```
http://localhost:3000/graphql
```

## 🔐 Authentication

### User Registration
```graphql
mutation {
  createUser(createUserDto: {
    email: "user@example.com"
    firstName: "Berkant"
    lastName: "Özdemir"
    username: "Bes-js"
    password: "password123"
  }) {
    id
    email
    firstName
    lastName
    username
    role
    isActive
    isEmailVerified
    createdAt
  }
}
```

**Note:** After user registration, an email verification is sent. Users cannot login until they verify their email.

### Login
```graphql
mutation {
  login(loginDto: {
    email: "user@example.com"
    password: "password123"
  })
}
```

**Response:**
```json
{
  "data": {
    "login": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Email Verification
```graphql
mutation {
  verifyEmail(verifyEmailDto: {
    token: "emailVerificationTokenHere"
  })
}
```

### Resend Verification Email
```graphql
mutation {
  resendVerificationEmail(resendVerificationDto: {
    email: "user@example.com"
  })
}
```

### Authorization Header
Add Authorization header to GraphQL requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📦 API Endpoints

### 👥 Users

#### 1. Create User (Public)
```graphql
mutation {
  createUser(createUserDto: {
    email: "admin@example.com"
    firstName: "Admin"
    lastName: "User"
    username: "admin"
    password: "admin123"
    role: "admin"
  }) {
    id
    email
    firstName
    lastName
    username
    role
    isActive
    isEmailVerified
    createdAt
  }
}
```

#### 2. Get All Users (Admin Only)
```graphql
query {
  users {
    id
    email
    firstName
    lastName
    username
    role
    isActive
    isEmailVerified
    createdAt
    orders {
      id
      orderNumber
      status
    }
  }
}
```

#### 3. Get User Details (Authenticated)
```graphql
query {
  user(id: "userIdHere") {
    id
    email
    firstName
    lastName
    username
    role
    isActive
    isEmailVerified
    createdAt
    orders {
      id
      orderNumber
      totalAmount
      status
      createdAt
    }
  }
}
```

#### 4. Update User (Authenticated)
```graphql
mutation {
  updateUser(
    id: "userIdHere"
    updateUserDto: {
      firstName: "Updated Name"
      lastName: "Updated Last Name"
    }
  ) {
    id
    firstName
    lastName
    updatedAt
  }
}
```

#### 5. Delete User (Admin Only)
```graphql
mutation {
  removeUser(id: "userIdHere") {
    id
    email
  }
}
```

### 🏷️ Categories

#### 1. Create Category (Admin Only)
```graphql
mutation {
  createCategory(createCategoryDto: {
    name: "Electronics"
    description: "Electronic products category"
    image: "https://example.com/electronics.jpg"
  }) {
    id
    name
    description
    image
    isActive
    createdAt
  }
}
```

#### 2. Get All Categories (Public)
```graphql
query {
  categories {
    id
    name
    description
    image
    isActive
    createdAt
    products {
      id
      name
      price
    }
  }
}
```

#### 3. Get Category Details (Public)
```graphql
query {
  category(id: "categoryIdHere") {
    id
    name
    description
    image
    isActive
    createdAt
    products {
      id
      name
      price
      description
      stock
    }
  }
}
```

#### 4. Update Category (Admin Only)
```graphql
mutation {
  updateCategory(
    id: "categoryIdHere"
    updateCategoryDto: {
      name: "Updated Category"
      description: "Updated description"
    }
  ) {
    id
    name
    description
    updatedAt
  }
}
```

#### 5. Delete Category (Admin Only)
```graphql
mutation {
  removeCategory(id: "categoryIdHere") {
    id
    name
  }
}
```

### 📦 Products

#### 1. Create Product (Admin Only)
```graphql
mutation {
  createProduct(createProductDto: {
    name: "iPhone 16 Pro Max"
    description: "Apple iPhone 16 Pro Max 256GB"
    price: 1199.99
    discountPrice: 999.99
    stock: 55
    isActive: true
    isFeatured: true
    images: [
      "https://example.com/iphone1.jpg",
      "https://example.com/iphone2.jpg"
    ]
    specifications: {
      "storage": "256GB",
      "color": "Desert Titanium",
      "screen": "6.9 inch",
      "cpu": "Apple A18 Pro"
    }
    categoryId: "categoryIdHere"
  }) {
    id
    name
    description
    price
    discountPrice
    stock
    isActive
    isFeatured
    rating
    reviewCount
    images
    specifications
    createdAt
    category {
      id
      name
    }
  }
}
```

#### 2. Get All Products (Public)
```graphql
query {
  products {
    id
    name
    description
    price
    discountPrice
    stock
    isActive
    isFeatured
    rating
    reviewCount
    images
    specifications
    createdAt
    category {
      id
      name
    }
    variants {
      id
      name
      price
      stock
    }
  }
}
```

#### 3. Get Featured Products (Public)
```graphql
query {
  featuredProducts {
    id
    name
    description
    price
    discountPrice
    stock
    rating
    reviewCount
    images
    category {
      id
      name
    }
  }
}
```

#### 4. Get Products by Category (Public)
```graphql
query {
  productsByCategory(categoryId: "categoryIdHere") {
    id
    name
    description
    price
    discountPrice
    stock
    isActive
    rating
    reviewCount
    images
    category {
      id
      name
    }
  }
}
```

#### 5. Get Product Details (Public)
```graphql
query {
  product(id: "productIdHere") {
    id
    name
    description
    price
    discountPrice
    stock
    isActive
    isFeatured
    rating
    reviewCount
    images
    specifications
    createdAt
    category {
      id
      name
      description
    }
    variants {
      id
      name
      price
      discountPrice
      stock
      attributes
      sku
      isActive
    }
  }
}
```

#### 6. Update Product (Admin Only)
```graphql
mutation {
  updateProduct(
    id: "productIdHere"
    updateProductDto: {
      name: "Updated Product Name"
      price: 1099.99
      stock: 75
      isFeatured: true
    }
  ) {
    id
    name
    price
    stock
    isFeatured
    updatedAt
  }
}
```

#### 7. Delete Product (Admin Only)
```graphql
mutation {
  removeProduct(id: "productIdHere") {
    id
    name
  }
}
```

### 🔄 Variants

#### 1. Create Variant (Admin Only)
```graphql
mutation {
  createVariant(createVariantDto: {
    name: "256GB Black Titanium"
    price: 1099.99
    discountPrice: 999.99
    stock: 25
    attributes: {
      "storage": "256GB",
      "color": "Black Titanium",
      "size": "6.9 inch"
    }
    sku: "IPHONE16PRO-MAX-256-BLACK-TITANIUM"
    isActive: true
    productId: "productIdHere"
  }) {
    id
    name
    price
    discountPrice
    stock
    attributes
    sku
    isActive
    createdAt
    product {
      id
      name
    }
  }
}
```

#### 2. Get All Variants (Public)
```graphql
query {
  variants {
    id
    name
    price
    discountPrice
    stock
    attributes
    sku
    isActive
    createdAt
    product {
      id
      name
    }
  }
}
```

#### 3. Get Variants by Product (Public)
```graphql
query {
  variantsByProduct(productId: "productIdHere") {
    id
    name
    price
    discountPrice
    stock
    attributes
    sku
    isActive
  }
}
```

#### 4. Get Variant Details (Public)
```graphql
query {
  variant(id: "variantIdHere") {
    id
    name
    price
    discountPrice
    stock
    attributes
    sku
    isActive
    createdAt
    product {
      id
      name
      description
    }
  }
}
```

#### 5. Update Variant (Admin Only)
```graphql
mutation {
  updateVariant(
    id: "variantIdHere"
    updateVariantDto: {
      price: 1399.99
      stock: 30
      attributes: {
        "storage": "512GB",
        "color": "Black Titanium"
      }
    }
  ) {
    id
    name
    price
    stock
    attributes
    updatedAt
  }
}
```

#### 6. Delete Variant (Admin Only)
```graphql
mutation {
  removeVariant(id: "variantIdHere") {
    id
    name
  }
}
```

### 🛒 Orders

#### 1. Create Order (Authenticated)
```graphql
mutation {
  createOrder(createOrderDto: {
    totalAmount: 1099.99
    discountAmount: 100.00
    finalAmount: 999.99
    shippingAddress: {
      "firstName": "Berkant",
      "lastName": "Özdemir",
      "address": "123 Main St",
      "city": "Istanbul",
      "country": "Turkey",
      "postalCode": "34000",
      "phone": "+905551234567"
    }
    billingAddress: {
      "firstName": "Berkant",
      "lastName": "Özdemir",
      "address": "123 Main St",
      "city": "Istanbul",
      "country": "Turkey",
      "postalCode": "34000",
      "phone": "+905551234567"
    }
    notes: "Please package carefully"
    orderItems: [
      {
        productId: "productIdHere"
        variantId: "variantIdHere"
        quantity: 2
      },
      {
        productId: "anotherProductId"
        quantity: 1
      }
    ]
  }) {
    id
    orderNumber
    totalAmount
    discountAmount
    finalAmount
    status
    shippingAddress
    billingAddress
    notes
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
    orderItems {
      id
      quantity
      unitPrice
      totalPrice
      product {
        id
        name
      }
      variant {
        id
        name
      }
    }
  }
}
```

#### 2. Get All Orders (Admin Only)
```graphql
query {
  orders {
    id
    orderNumber
    totalAmount
    discountAmount
    finalAmount
    status
    shippingAddress
    billingAddress
    notes
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
    orderItems {
      id
      quantity
      unitPrice
      totalPrice
      product {
        id
        name
      }
      variant {
        id
        name
      }
    }
  }
}
```

#### 3. Get User Orders (Authenticated)
```graphql
query {
  myOrders {
    id
    orderNumber
    totalAmount
    discountAmount
    finalAmount
    status
    shippingAddress
    billingAddress
    notes
    createdAt
    orderItems {
      id
      quantity
      unitPrice
      totalPrice
      product {
        id
        name
        images
      }
      variant {
        id
        name
      }
    }
  }
}
```

#### 4. Get Order Details (Authenticated)
```graphql
query {
  order(id: "orderIdHere") {
    id
    orderNumber
    totalAmount
    discountAmount
    finalAmount
    status
    shippingAddress
    billingAddress
    notes
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
    orderItems {
      id
      quantity
      unitPrice
      totalPrice
      product {
        id
        name
        description
        images
      }
      variant {
        id
        name
        attributes
      }
    }
  }
}
```

#### 5. Update Order (Admin Only)
```graphql
mutation {
  updateOrder(
    id: "orderIdHere"
    updateOrderDto: {
      notes: "Updated notes"
    }
  ) {
    id
    orderNumber
    notes
    updatedAt
  }
}
```

#### 6. Update Order Status (Admin Only)
```graphql
mutation {
  updateOrderStatus(
    id: "orderIdHere"
    status: "shipped"
  ) {
    id
    orderNumber
    status
    updatedAt
  }
}
```

#### 7. Delete Order (Admin Only)
```graphql
mutation {
  removeOrder(id: "orderIdHere") {
    id
    orderNumber
  }
}
```

## 🔧 Configuration

### Environment Variables
```env
# Application
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-secret-key

# Database
DB_TYPE=sqlite
DB_DATABASE=database.sqlite

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ecommerce.com
FRONTEND_URL=http://localhost:3000

# Kafka (Optional)
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=ecommerce-api
KAFKA_GROUP_ID=ecommerce-group
KAFKAJS_NO_PARTITIONER_WARNING=1
```

### Email Configuration
For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

### Kafka Configuration
Kafka integration requires a running Kafka service. The application works without Kafka.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📁 Project Structure

```
src/
├── auth/                # Authentication
│   ├── guards/          # Guards
│   ├── strategies/      # JWT strategy
│   ├── decorators/      # Custom decorators
│   └── dto/             # Auth DTOs
├── users/               # User module
├── products/            # Product module
├── variants/            # Variant module
├── categories/          # Category module
├── orders/              # Order module
├── email/               # Email service
├── kafka/               # Kafka integration
├── types/               # TypeScript types
└── main.ts              # Application entry point
```

## 🚀 Deployment

### Docker
```bash
docker build -t nestjs-ecommerce-api .
docker run -p 3000:3000 nestjs-ecommerce-api
```

### Production
```bash
npm run build
npm run start:prod
```

## 📝 License

This project is licensed under the GPL-3.0 License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions about the project, please open an issue.
