# NurseSchedule


* เข้าสู่ระบบ
POST /api/auth/login 
* สมัครสมาชิก
POST /api/auth/register
* ออกจากระบบ
DELETE /api/auth/logout

* สร้างตารางเวรทั้งหมด
POST /api/schedule/create

* ดึงข้อมูลตารางของตัวเองในเดือนปัจุบันทั้งหมด
GET /api/schedule/me/present (Token)
* ดึงกลุ่มที่กำหนด
GET /api/schedule/me/present/group/:id (Token)



* สร้างกลุ่ม (หัวหน้าพยาบาล)
* POST /api/group/create 
  Body title String
  
