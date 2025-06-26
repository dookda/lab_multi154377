ได้เลยครับ ด้านล่างนี้คือตัวอย่าง **เอกสารประกอบการสอนบทปฏิบัติการ** ใช้เวลา 6 ชั่วโมง เรื่อง **การใช้งาน ReactJS Framework** เหมาะสำหรับนักศึกษาระดับปริญญาตรีในรายวิชาเกี่ยวกับการพัฒนาเว็บไซต์หรือเทคโนโลยีเว็บ:

---

# เอกสารประกอบการสอนบทปฏิบัติการ

**หัวข้อ**: การใช้งาน ReactJS Framework
**ระยะเวลา**: 6 ชั่วโมง (แบ่งเป็น 2 ช่วง: 3 ชั่วโมง x 2 ครั้ง)
**กลุ่มวิชา**: การพัฒนาเว็บแอปพลิเคชัน / วิทยาการคอมพิวเตอร์ / ภูมิสารสนเทศเชิงโปรแกรม
**ระดับชั้น**: ปริญญาตรี ปี 2-3

---

## 1. วัตถุประสงค์

เมื่อจบบทปฏิบัติการนี้ นักศึกษาจะสามารถ:

* เข้าใจแนวคิดพื้นฐานของ ReactJS เช่น Component, Props, State
* สร้างและจัดการ Component ด้วย React
* ติดตั้งและใช้งาน React ด้วย Vite หรือ Create React App
* พัฒนาแอปพลิเคชันเว็บอย่างง่ายด้วย React โดยใช้ JSX
* จัดการ Event และ State ภายใน Component
* ใช้ React Hook (`useState`, `useEffect`) ได้อย่างถูกต้อง

---

## 2. อุปกรณ์และเครื่องมือ

* คอมพิวเตอร์พร้อมระบบปฏิบัติการ Windows, macOS หรือ Linux
* ติดตั้ง Node.js และ npm (เวอร์ชันแนะนำ: LTS)
* โปรแกรม VS Code หรือ Code Editor อื่น ๆ
* Command Line หรือ Terminal
* Web browser (Google Chrome หรือ Firefox)

---

## 3. ขั้นตอนปฏิบัติ

### **ช่วงที่ 1: พื้นฐาน ReactJS และการสร้าง Component (3 ชั่วโมง)**

#### กิจกรรม 1: ติดตั้งและเริ่มต้นโครงการ React (30 นาที)

1. ตรวจสอบ Node.js และ npm:

```bash
node -v
npm -v
```

2. สร้างโปรเจกต์ด้วย Vite:

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

หรือใช้ Create React App (ถ้าต้องการ):

```bash
npx create-react-app my-react-app
cd my-react-app
npm start
```

---

#### กิจกรรม 2: เข้าใจโครงสร้างโปรเจกต์ (30 นาที)

* อธิบายโฟลเดอร์ `src/`, `App.jsx`, `main.jsx`
* แนะนำ JSX syntax
* ลบไฟล์ไม่จำเป็นออก แล้วสร้างหน้าเว็บ “Hello React!”

```jsx
function App() {
  return <h1>Hello React!</h1>;
}
```

---

#### กิจกรรม 3: การสร้าง Component และใช้ Props (1 ชั่วโมง)

* สร้างไฟล์ `StudentCard.jsx`

```jsx
function StudentCard(props) {
  return (
    <div className="card">
      <h3>{props.name}</h3>
      <p>Major: {props.major}</p>
    </div>
  );
}
export default StudentCard;
```

* นำมาใช้งานใน `App.jsx`

```jsx
import StudentCard from './StudentCard';

function App() {
  return (
    <div>
      <StudentCard name="Sakda" major="Geography" />
      <StudentCard name="Somchai" major="Computer Science" />
    </div>
  );
}
```

---

#### กิจกรรม 4: การใช้ State และ Event (1 ชั่วโมง)

* ใช้ `useState`:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>เพิ่ม</button>
    </div>
  );
}
```

* นำ `Counter` มาแสดงใน `App.jsx`

---

### **ช่วงที่ 2: การจัดการข้อมูล, Hook และแบบฝึกปฏิบัติ (3 ชั่วโมง)**

#### กิจกรรม 5: การใช้ useEffect เพื่อโหลดข้อมูล (1 ชั่วโมง)

* ตัวอย่างโหลดข้อมูลจาก API:

```jsx
import { useEffect, useState } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

#### กิจกรรม 6: แบบฝึกหัดสร้างเว็บแอปแบบง่าย (1.5 ชั่วโมง)

**โจทย์:** สร้างแอป “รายชื่อนักศึกษา” โดยประกอบด้วย:

* กล่อง input เพื่อกรอกชื่อ
* ปุ่ม “เพิ่ม” เพื่อนำชื่อเข้าสู่รายชื่อ
* รายการรายชื่อนักศึกษาที่เพิ่มเข้ามา
* ปุ่ม “ลบ” เพื่อเอารายชื่อออก

```jsx
function StudentList() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');

  const addStudent = () => {
    if (name.trim()) {
      setStudents([...students, name]);
      setName('');
    }
  };

  const removeStudent = (index) => {
    const newList = students.filter((_, i) => i !== index);
    setStudents(newList);
  };

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={addStudent}>เพิ่ม</button>
      <ul>
        {students.map((s, i) => (
          <li key={i}>
            {s} <button onClick={() => removeStudent(i)}>ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

#### กิจกรรม 7: สรุปและตอบคำถาม (30 นาที)

* สรุปแนวคิดหลัก: Component, Props, State, Hook
* แนะนำ React Router และการแยกหน้า (Routing) (สั้น ๆ)
* แนะนำแหล่งเรียนรู้เพิ่มเติม

---

## 4. งานที่มอบหมาย

### **Project Assignment: สร้าง Web Application ด้วย React**

**หัวข้อ:** นักศึกษาสร้างแอปพลิเคชันเว็บ “ระบบจัดการงานส่วนตัว” ประกอบด้วย:

* หน้าหลัก (แสดงรายการงานทั้งหมด)
* เพิ่มงานใหม่ (ใช้ฟอร์มและ `useState`)
* ลบงาน / ทำเครื่องหมายว่างานเสร็จ
* ใช้ component อย่างน้อย 3 ชิ้น
* ใช้ `useEffect` อย่างน้อย 1 ครั้ง
* ใช้ CSS พื้นฐานในการจัดรูปแบบ (หรือ Bootstrap/Tailwind ก็ได้)

**ส่งไฟล์:** GitHub Repository หรือ zip ไฟล์
**กำหนดส่ง:** ภายใน 1 สัปดาห์

---

หากต้องการไฟล์ `.docx` หรือ `.pdf` หรือให้ใส่โลโก้สถาบัน ผมสามารถจัดรูปแบบให้เหมาะกับการแจกในห้องเรียนได้ครับ
ต้องการให้จัดทำเป็นไฟล์เอกสารไหมครับ?
