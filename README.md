
# 🚀 Dream API  

A powerful and scalable **Node.js API** for managing and processing dream-related data, deployed on **Google Cloud Run** with **CI/CD via Google Cloud Build**.

---

## 📌 Features  
✅ Secure **MongoDB** integration with GitHub Secrets  
✅ Deployed on **Google Cloud Run**  
✅ Automated **CI/CD** pipeline with **Google Cloud Build**  
✅ Scalable and containerized with **Docker**  
✅ Well-structured API endpoints  

---

## 🛠️ Tech Stack  

| Technology     | Purpose                      |
|---------------|------------------------------|
| **Node.js**   | Backend API                  |
| **Express.js**| Web framework for API        |
| **MongoDB**   | Database                     |
| **Docker**    | Containerization             |
| **Google Cloud Run** | Deployment Platform  |
| **Google Cloud Build** | CI/CD Pipeline    |
| **GitHub Actions** | Version Control & CI/CD |

---

## 🚀 Deployment & CI/CD Setup  

### 🌐 **Google Cloud Setup**  
1️⃣ **Create a Google Cloud Project**  
2️⃣ **Enable Cloud Run & Cloud Build APIs**  
3️⃣ **Set up GitHub Secrets for MongoDB URI**  
4️⃣ **Create a `cloudbuild.yaml` for deployment**  

---

## 🔧 Local Setup  

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/vikashcoder/Dream_Api.git
cd Dream_Api
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Configure Environment Variables**  
Create a `.env` file:  
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### **4️⃣ Run the Server**
```sh
npm start
```

---

## 📌 API Endpoints  

### **👤 User Endpoints**  
| Method | Endpoint       | Description        |
|--------|--------------|------------------|
| `POST` | `/dreams`    | Add a new dream |
| `GET`  | `/dreams`    | Fetch all dreams |
| `GET`  | `/dreams/:id` | Fetch a specific dream |
| `DELETE` | `/dreams/:id` | Remove a dream |

---

## 🎯 CI/CD Pipeline  

### **✅ Google Cloud Build Steps**  
1️⃣ **Trigger Build on `git push`**  
2️⃣ **Build & Push Docker Image to GCR**  
3️⃣ **Deploy to Google Cloud Run**  



---

## 📬 Contact  
👨‍💻 **Vikash Raj**  
📧 [Email](mailto:vikashcoder@example.com)  
🔗 [GitHub](https://github.com/vikashcoder)  


