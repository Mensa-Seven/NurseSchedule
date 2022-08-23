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
* ดึงข้อมูลเวลทั้งหมด
GET /api/schedule/me/all (Token)
* ดึงกลุ่มที่กำหนด
GET /api/schedule/me/present/group/:id (Token)
* ดึงผลัดที่ตัวเองมีการขึ้นผลัด
GET /api/schedule/me/present/shift (Token)
* ดึงตารางของกลุ่มตัวเองอยู่ขึ้นมา 
GET /api/schedule/me/all/ (Token)
  - body name_group
  - params name_group

* ดึงข้อมูลสมาชิกในกลุ่ม
GET /api/group/me/member (Token)
* สร้างกลุ่ม
POST /api/group/create (Token)
  - body name_group
* เพิ่ทมสมาชิกเข้ากลุ่ม
PUT /api/group/addmember (Token)
  - body email
  - body name_group
 * ลบสมาชิกใน กลุ่ม
DELETE /api/group/removemember (Token)
  - body groupId
  - body email
  
 * การจัดตาราง
 PATCH /api/schedule/update/schedule
  - body _id
  - body _user
  - body year
  - body month
  - body day
  - body group
  - body morning
  - body noon
  - body night
  - body count
  
* สร้างตารางอัตโนมัติ ให้กับสมาชิกภายในกลุ่ม
PATCH /api/group/create/auto/:groupId
* ดึง ข้อมูลกลุ่มทั้งหมด ที่เราอยู่ในกลุ่มนั้น
GET /api/group/list/me/all (Token)

* ดึงสมาชิกที่อยู่ในโรงพยาบาลของตัวเอง (ไม่มีฉัน)
GET /api/group/list/member/location
* ดึงข้อมูลตารางสมาชิกที่เเล้ว เเละอยู่ในโณงพยาบาลกับเรา ออกมา (ไม่มีเรา)
GET /api/group/schedule/without/me (Token)
* ดึงข้อมูลสมาชิกทั้งหมดที่อยู่ในกลุ่มเรา 
GET /api/group/schedule/me/all (Token) 
  - params: name_group



* สร้างกลุ่ม (หัวหน้าพยาบาล)
* POST /api/group/create 
  Body name_group String
 
* เชิญสมาชิกเข้ากลุ่ม (หัวหน้าพยาบาล)
POST /api/invite/invite (Token)
  - body email
  - body name_group
  
* ดึงคำเชิญที่ส่งมาถึงเรา
GET /api/invite/invite (Token)
