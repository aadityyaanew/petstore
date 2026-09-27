import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Helper to send an email
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };
  await getTransporter().sendMail(mailOptions);
};

/**
 * HTML table rows for order items
 */
const buildItemsTable = (items) => {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px; border-bottom:1px solid #F1F5F9;">${item.name}</td>
        <td style="padding:10px 8px; border-bottom:1px solid #F1F5F9; text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px; border-bottom:1px solid #F1F5F9; text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="padding:10px 8px; border-bottom:1px solid #F1F5F9; text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');
};

/**
 * Send order confirmation email to the customer
 */
export const sendOrderConfirmationEmail = async (user, order) => {
  const itemsHtml = buildItemsTable(order.items);
  const { fullName, street, city, state, zipCode, country, phone } = order.shippingAddress;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#6C63FF,#4ECDC4);padding:36px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">🛍️ ShopEase</h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Order Confirmed!</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                <h2 style="margin:0 0 8px;color:#1E293B;font-size:22px;">Hello, ${user.name}! 👋</h2>
                <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
                  Thank you for your order! We've received it and will start processing it right away.
                </p>

                <!-- Order Info -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:28px;">
                  <tr>
                    <td style="color:#64748B;font-size:13px;padding-bottom:6px;">ORDER ID</td>
                    <td style="color:#1E293B;font-size:13px;font-weight:700;text-align:right;padding-bottom:6px;">#${order._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748B;font-size:13px;padding-bottom:6px;">PAYMENT METHOD</td>
                    <td style="color:#1E293B;font-size:13px;font-weight:700;text-align:right;padding-bottom:6px;">${order.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748B;font-size:13px;">STATUS</td>
                    <td style="text-align:right;">
                      <span style="background:#DCFCE7;color:#16A34A;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;">${order.status.toUpperCase()}</span>
                    </td>
                  </tr>
                </table>

                <!-- Items Table -->
                <h3 style="margin:0 0 16px;color:#1E293B;font-size:16px;font-weight:700;">Order Items</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px;">
                  <thead>
                    <tr style="background:#F1F5F9;">
                      <th style="padding:10px 8px;text-align:left;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;">Product</th>
                      <th style="padding:10px 8px;text-align:center;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;">Qty</th>
                      <th style="padding:10px 8px;text-align:right;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;">Price</th>
                      <th style="padding:10px 8px;text-align:right;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <!-- Price Summary -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                  <tr>
                    <td style="padding:4px 0;color:#64748B;font-size:14px;">Subtotal</td>
                    <td style="padding:4px 0;color:#1E293B;font-size:14px;text-align:right;">₹${order.itemsPrice.toFixed(2)}</td>
                  </tr>
                  ${order.discountAmount > 0 ? `
                  <tr>
                    <td style="padding:4px 0;color:#16A34A;font-size:14px;">Discount (${order.couponCode})</td>
                    <td style="padding:4px 0;color:#16A34A;font-size:14px;text-align:right;">-₹${order.discountAmount.toFixed(2)}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding:4px 0;color:#64748B;font-size:14px;">Shipping</td>
                    <td style="padding:4px 0;color:#1E293B;font-size:14px;text-align:right;">${order.shippingPrice === 0 ? 'FREE' : '₹' + order.shippingPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 4px;color:#1E293B;font-size:17px;font-weight:800;border-top:2px solid #E2E8F0;">Total Paid</td>
                    <td style="padding:12px 0 4px;color:#6C63FF;font-size:17px;font-weight:800;text-align:right;border-top:2px solid #E2E8F0;">₹${order.totalPrice.toFixed(2)}</td>
                  </tr>
                </table>

                <!-- Shipping Address -->
                <h3 style="margin:0 0 12px;color:#1E293B;font-size:16px;font-weight:700;">Shipping Address</h3>
                <div style="background:#F8FAFC;border-radius:12px;padding:16px 20px;margin-bottom:28px;color:#475569;font-size:14px;line-height:1.8;">
                  <strong>${fullName}</strong><br/>
                  ${street}, ${city}, ${state} - ${zipCode}<br/>
                  ${country}<br/>
                  📞 ${phone}
                </div>
                
                <p style="margin:0;color:#94A3B8;font-size:13px;text-align:center;line-height:1.6;">
                  If you have any questions, reply to this email or contact our support team.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#F8FAFC;padding:20px 40px;text-align:center;border-top:1px solid #E2E8F0;">
                <p style="margin:0;color:#94A3B8;font-size:12px;">© 2024 ShopEase. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `✅ Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()} | ShopEase`,
    html,
  });
};

/**
 * Send new order alert to admin
 */
export const sendNewOrderAlertEmail = async (order, userEmail) => {
  const itemsHtml = buildItemsTable(order.items);

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
            
            <tr>
              <td style="background:linear-gradient(135deg,#FF6584,#FF4E50);padding:30px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">🔔 New Order Received!</h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Someone just placed an order on ShopEase</p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF5F5;border-radius:12px;padding:20px;margin-bottom:24px;">
                  <tr>
                    <td style="color:#64748B;font-size:13px;padding-bottom:8px;">ORDER ID</td>
                    <td style="color:#1E293B;font-size:13px;font-weight:700;text-align:right;padding-bottom:8px;">#${order._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748B;font-size:13px;padding-bottom:8px;">CUSTOMER EMAIL</td>
                    <td style="color:#1E293B;font-size:13px;font-weight:700;text-align:right;padding-bottom:8px;">${userEmail}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748B;font-size:13px;padding-bottom:8px;">PAYMENT METHOD</td>
                    <td style="color:#1E293B;font-size:13px;font-weight:700;text-align:right;padding-bottom:8px;">${order.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748B;font-size:13px;">ORDER TOTAL</td>
                    <td style="color:#FF4E50;font-size:15px;font-weight:800;text-align:right;">₹${order.totalPrice.toFixed(2)}</td>
                  </tr>
                </table>

                <h3 style="margin:0 0 16px;color:#1E293B;font-size:16px;">Items Ordered</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
                  <thead>
                    <tr style="background:#F1F5F9;">
                      <th style="padding:10px 8px;text-align:left;font-size:12px;color:#64748B;font-weight:600;">Product</th>
                      <th style="padding:10px 8px;text-align:center;font-size:12px;color:#64748B;font-weight:600;">Qty</th>
                      <th style="padding:10px 8px;text-align:right;font-size:12px;color:#64748B;font-weight:600;">Price</th>
                      <th style="padding:10px 8px;text-align:right;font-size:12px;color:#64748B;font-weight:600;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>

                <p style="color:#64748B;font-size:13px;margin:0;">
                  Login to your <strong>Admin Panel</strong> to manage this order.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#F8FAFC;padding:16px 40px;text-align:center;border-top:1px solid #E2E8F0;">
                <p style="margin:0;color:#94A3B8;font-size:12px;">ShopEase Admin Notification</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order #${order._id.toString().slice(-8).toUpperCase()} — ₹${order.totalPrice.toFixed(2)} | ShopEase`,
    html,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

            <tr>
              <td style="background:linear-gradient(135deg,#6C63FF,#9B59B6);padding:36px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">🔐 ShopEase</h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Password Reset Request</p>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 40px;">
                <h2 style="margin:0 0 12px;color:#1E293B;font-size:20px;">Hi, ${user.name} 👋</h2>
                <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.7;">
                  We received a request to reset the password for your ShopEase account. 
                  Click the button below to set a new password.
                </p>

                <div style="text-align:center;margin:32px 0;">
                  <a href="${resetUrl}" 
                     style="background:linear-gradient(135deg,#6C63FF,#9B59B6);color:#ffffff;text-decoration:none;padding:15px 36px;border-radius:12px;font-size:16px;font-weight:700;display:inline-block;">
                    Reset My Password
                  </a>
                </div>

                <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
                  <p style="margin:0;color:#92400E;font-size:13px;line-height:1.6;">
                    ⚠️ <strong>This link expires in 15 minutes.</strong> If you did not request a password reset, 
                    please ignore this email. Your password will remain unchanged.
                  </p>
                </div>

                <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.6;">
                  If the button doesn't work, copy and paste this link into your browser:<br/>
                  <span style="color:#6C63FF;word-break:break-all;">${resetUrl}</span>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#F8FAFC;padding:20px 40px;text-align:center;border-top:1px solid #E2E8F0;">
                <p style="margin:0;color:#94A3B8;font-size:12px;">© 2024 ShopEase. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: '🔐 Reset Your ShopEase Password',
    html,
  });
};

/**
 * Send low-stock alert email to admin
 * @param {Array} products - Array of products with low stock
 */
export const sendLowStockAlertEmail = async (products) => {
  if (!products || products.length === 0) return;

  const rowsHtml = products
    .map(
      (p) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #F1F5F9;font-weight:500;">${p.name}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #F1F5F9;text-align:center;">${p.category}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #F1F5F9;text-align:center;">
          <span style="background:${p.stock === 0 ? '#FEE2E2' : '#FEF3C7'};color:${p.stock === 0 ? '#DC2626' : '#D97706'};padding:3px 10px;border-radius:20px;font-weight:700;font-size:13px;">
            ${p.stock === 0 ? 'OUT OF STOCK' : p.stock + ' left'}
          </span>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #F1F5F9;text-align:center;color:#64748B;">${p.lowStockThreshold}</td>
      </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

            <tr>
              <td style="background:linear-gradient(135deg,#F59E0B,#EF4444);padding:30px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">⚠️ Low Stock Alert!</h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">The following products need your attention on ShopEase</p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 40px;">
                <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
                  Hi Admin 👋, the products listed below have reached or fallen below their low-stock threshold after a recent order. Please restock them to avoid losing sales.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <thead>
                    <tr style="background:#FEF3C7;">
                      <th style="padding:10px 8px;text-align:left;font-size:12px;color:#92400E;font-weight:700;text-transform:uppercase;">Product</th>
                      <th style="padding:10px 8px;text-align:center;font-size:12px;color:#92400E;font-weight:700;text-transform:uppercase;">Category</th>
                      <th style="padding:10px 8px;text-align:center;font-size:12px;color:#92400E;font-weight:700;text-transform:uppercase;">Current Stock</th>
                      <th style="padding:10px 8px;text-align:center;font-size:12px;color:#92400E;font-weight:700;text-transform:uppercase;">Threshold</th>
                    </tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
                </table>

                <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:16px 20px;margin-top:24px;">
                  <p style="margin:0;color:#92400E;font-size:13px;line-height:1.6;">
                    🔗 <strong>Action needed:</strong> Please log in to your Admin Panel and update the stock quantities for the products listed above.
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="background:#F8FAFC;padding:16px 40px;text-align:center;border-top:1px solid #E2E8F0;">
                <p style="margin:0;color:#94A3B8;font-size:12px;">ShopEase Admin Notification — Inventory Alert</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `⚠️ Low Stock Alert — ${products.length} product(s) need restocking | ShopEase`,
    html,
  });
};
