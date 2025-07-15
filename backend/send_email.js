const nodemailer = require("nodemailer");

const send_email = async (name, email, action, reason) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kasetinsri.app@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
  });

  let htmlContent = "";

  if (action === "register") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #2E8B57; text-align: center;">สวัสดีคุณ ${name} 👋</h2>
        <p style="font-size: 16px;">ขอบคุณที่สมัครสมาชิกกับเรา</p>
        <p style="font-size: 16px;">ตอนนี้ข้อมูลของคุณอยู่ในขั้นตอนการตรวจสอบ รอผลการอนุมัติอีกครั้ง ผ่านอีเมล์ที่ท่านใช้สมัครสมาชิก</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="font-size: 14px; color: #555;">หากมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม สามารถติดต่อเราได้ที่<br>
          <a href="mailto:kasetinsri.app@gmail.com" style="color: #2E8B57; text-decoration: none;">kasetinsri.app@gmail.com</a>
        </p>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
          ขอบคุณครับ<br/>
          <strong>เว็ปแอปพลิเคชันแนวทางการเลี้ยงสัตว์แบบเกษตรอินทรีย์</strong>
        </p>
      </div>
    `;
  } else if (action === "approved") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f6fff6;">
        <h2 style="color: #2E8B57; text-align: center;">ยินดีด้วยคุณ ${name} 🎉</h2>
        <p style="font-size: 16px;">ระบบได้ทำการอนุมัติการสมัครสมาชิกของคุณเรียบร้อยแล้ว</p>
        <p style="font-size: 16px;">คุณสามารถเข้าสู่ระบบเพื่อใช้งานแพลตฟอร์มของเราได้ทันที</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="font-size: 14px; color: #555;">ติดต่อสอบถาม: 
          <a href="mailto:kasetinsri.app@gmail.com" style="color: #2E8B57; text-decoration: none;">kasetinsri.app@gmail.com</a>
        </p>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
          ขอบคุณครับ<br/>
          <strong>เว็ปแอปพลิเคชันแนวทางการเลี้ยงสัตว์แบบเกษตรอินทรีย์</strong>
        </p>
      </div>
    `;
  } else if (action === "rejected") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #fff5f5;">
        <h2 style="color: #d9534f; text-align: center;">ขออภัยคุณ ${name} 😥</h2>
        <p style="font-size: 16px;">ระบบได้ทำการตรวจสอบข้อมูลของคุณแล้ว และขอแจ้งว่าการสมัครสมาชิกไม่ผ่านการอนุมัติ</p>
        <p style="font-size: 16px;">เนื่องจาก ${reason}</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="font-size: 14px; color: #555;">ติดต่อสอบถาม: 
          <a href="mailto:kasetinsri.app@gmail.com" style="color: #d9534f; text-decoration: none;">kasetinsri.app@gmail.com</a>
        </p>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
          ขอบคุณครับ<br/>
          <strong>เว็ปแอปพลิเคชันแนวทางการเลี้ยงสัตว์แบบเกษตรอินทรีย์</strong>
        </p>
      </div>
    `;
  }

  const mailOptions = {
    from: "kasetinsri.app@gmail.com",
    to: email,
    subject: "แจ้งผลการสมัครสมาชิก",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ ส่งอีเมลสำเร็จถึง ${email}`);
  } catch (error) {
    console.error(`❌ ส่งอีเมลไม่สำเร็จ:`, error);
  }
};

module.exports = send_email;
