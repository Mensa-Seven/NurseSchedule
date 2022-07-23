# NurseSchedule


* เข้าสู่ระบบ
POST /api/auth/login 
* สมัครสมาชิก
POST /api/auth/register
* ออกจากระบบ
DELETE /api/auth/logout (Token)

* สร้างตารางเวรทั้งหมด
POST /api/schedule/create

* ดึงข้อมูลตารางของตัวเองในเดือนปัจุบันทั้งหมด
GET /api/schedule/me/present (Token)
* ดึงกลุ่มที่กำหนด
GET /api/schedule/me/present/group/:id (Token)
* ดึงผลัดที่ตัวเองมีการขึ้นผลัด
GET /api/schedule/me/present/shift (Token)

* ดึงข้อมูลสมาชิกในกลุ่ม
GET /api/group/me/member (Token)
* สร้างตารางอัตโนมัติ ให้กับสมาชิกภายในกลุ่ม
PATCH /api/group/create/auto/:groupId
* ดึงสมาชิกที่อยู่ในโรงพยาบาลของตัวเอง (ไม่มีฉัน)
GET /api/group/list/member/location
* ดึงข้อมูลตารางสมาชิกที่เเล้ว เเละอยู่ในโณงพยาบาลกับเรา ออกมา (ไม่มีเรา)
GET /api/group/schedule/without/me (Tone)
* ดึงข้อมูลสมาชิกทั้งหมดที่อยู่ในกลุ่มเรา 
GET /api/group/schedule/me/all (Token) 
  - Body: name_group



* สร้างกลุ่ม (หัวหน้าพยาบาล)
* POST /api/group/create 
  Body name_group String
  
