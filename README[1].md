# JMB PRINTING SERVICES - Loyalty Card Registration

This is a loyalty card registration web app for **JMB PRINTING SERVICES**, built using HTML, TailwindCSS, and vanilla JavaScript.

## 💡 Features

- Multi-step form (Details → Photo → Signature → Submit)
- Image upload with preview
- Digital signature pad (mouse or touch)
- Step-by-step progress indicator
- Summary and email confirmation simulation
- Auto-generated reference ID
- Responsive UI using TailwindCSS
- Success modal with redirect

## 🛠 Technologies

- HTML5
- Tailwind CSS via CDN
- Vanilla JavaScript (in `scripts.js`)

## 📁 File Structure

```
index.html            → Main HTML page (form & layout)
scripts.js            → JavaScript logic (form steps, validation, submission)
README.md             → Project documentation
```

## 🚀 Usage

1. Open `index.html` in any browser.
2. Click “GET YOUR LOYALTY CARD NOW” to begin.
3. Complete the form in all 4 steps.
4. Submit and confirm the email simulation.
5. Restart process or close.

> Note: Submission triggers a `mailto:` link and simulates email confirmation via console/log only.

## ✏️ Customization

You can:
- Update pricing, services, and contact info inside HTML
- Replace or connect backend (e.g., Firebase or PHP) for real email delivery

## 📸 Image & Signature

- Max 5MB photo (JPG, PNG, GIF)
- Signature drawn directly in canvas

---

Built with ❤️ by **JMB PRINTING SERVICES**
