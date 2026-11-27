# RRR TopUp — প্রিমিয়াম গেমিং টপ-আপ প্ল্যাটফর্ম

বাংলাদেশের প্রিমিয়াম গেমিং টপ-আপ প্ল্যাটফর্ম: Free Fire ডায়মন্ড, Weekly/Monthly মেম্বারশিপ, লেভেল আপ পাস, লাইক সার্ভিস ও PUBG Mobile UC — bKash/Nagad ম্যানুয়াল পেমেন্ট, অ্যাডমিন ভেরিফিকেশন, অর্ডার ট্র্যাকিংসহ।

**স্ট্যাক:** React 19 + Vite + Tailwind CSS v4 + React Router · Firebase Auth + Firestore (কনফিগার থাকলে) · Vercel (ফ্রন্টএন্ড + Serverless API)

## রুট

| রুট | পেজ |
|---|---|
| `/` | হোম — হিরো, ক্যাটাগরি, FF/PUBG প্যাকেজ, জনপ্রিয়, সাম্প্রতিক অর্ডার, কীভাবে কিনবেন, সাপোর্ট |
| `/free-fire` | ফ্রি ফায়ার — Diamonds / Weekly / Monthly / Weekly Lite / Level Up / Special / Like (ফিল্টার + সার্চ) |
| `/pubg` | PUBG Mobile — UC প্যাকেজ, Royale Pass, Special |
| `/product/:id` | প্যাকেজ বিস্তারিত + UID/মোবাইল ফর্ম → চেকআউট |
| `/checkout` | ৩ ধাপ: তথ্য → পেমেন্ট পদ্ধতি → Transaction ID |
| `/order-success/:id` | অর্ডার কনফার্মেশন (অর্ডার আইডি RRR-XXXXXX) |
| `/track` | অর্ডার আইডি + মোবাইল শেষ ৪ সংখ্যা দিয়ে ট্র্যাকিং |
| `/login` `/register` `/forgot` | কাস্টমার অথ (Firebase থাকলে আসল, না থাকলে ডেমো) |
| `/profile` `/my-orders` | প্রোফাইল ও অর্ডার হিস্ট্রি |
| `/contact` `/terms` `/privacy` `/refund` | সাপোর্ট ও নীতিমালা |
| `/admin` | অ্যাডমিন প্যানেল (ড্যাশবোর্ড, প্রোডাক্ট, অর্ডার, পেমেন্ট, সেটিংস) |

## ডেমো মোড (Firebase ছাড়া)

Firebase env var না থাকলে সাইট ডেমো মোডে চলে — অর্ডার/অ্যাকাউন্ট/সেটিংস এই ব্রাউজারের localStorage-এ থাকে, হোমপেজের সাম্প্রতিক অর্ডার "নমুনা অর্ডার" লেবেলসহ দেখায়। UI-তে ডেমো ব্যানার দেখানো হয়।

**ডেমো অ্যাডমিন:** `admin@rrrtopup.com` / `admin123` — লাইভে যাওয়ার আগে অবশ্যই বদলাতে হবে।

## লোকাল চালানো

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # প্রোডাকশন বিল্ড
npm run preview  # বিল্ড যাচাই
```

## Firebase সেটআপ (আসল ডেটার জন্য)

1. Firebase Console-এ নতুন প্রজেক্ট বানান (যেমন `rrr-topup`), Analytics OFF রাখা যায়।
2. Authentication → Email/Password চালু করুন।
3. Firestore Database বানান (অঞ্চল `asia-southeast1` ভালো)।
4. `firestore.rules` ফাইলের নিয়মগুলো Firestore → Rules-এ Publish করুন।
5. Project Settings → Web App থেকে ৬টি `VITE_FIREBASE_*` মান নিয়ে `.env` ফাইলে (বা Vercel env-এ) বসান — `.env.example` দেখুন।
6. প্রথম অ্যাডমিন: Firestore-এ `adminUsers/{uid}` ডকুমেন্টে `role: "admin"` বসান (UID = অ্যাডমিন ইউজারের Auth UID)।

## Vercel ডেপ্লয়

1. GitHub-এ রেপো push করুন।
2. Vercel-এ Import করুন (Framework: Vite, Build: `npm run build`, Output: `dist`)।
3. Environment Variables-এ ৬টি `VITE_FIREBASE_*` + `IMGBB_API_KEY` (যদি ImgBB ছবি আপলোড চান) বসান।
4. Deploy → লাইভ URL যাচাই করুন। SPA রাউটিংয়ের জন্য `vercel.json` rewrites দেওয়া আছে।

## পেমেন্ট সেটআপ

অ্যাডমিন প্যানেল → পেমেন্ট ট্যাবে আসল **bKash ও Nagad Send Money নম্বর** বসান। নম্বর ছাড়া গ্রাহক পেমেন্ট করতে পারবে না। পেমেন্ট কখনো অটো-অ্যাপ্রুভ হয় না — অ্যাডমিন Transaction ID নিজে যাচাই করে Verify/Reject করেন।

## নিরাপত্তা

- দাম সবসময় `src/data/products.js` থেকে নেওয়া হয় (`src/lib/price.js` → `verifyPrice`) — URL/ফর্মের দাম কখনো বিশ্বাস করা হয় না; চেকআউটে দুইবার যাচাই হয়।
- UID ৬–১২ সংখ্যা, মোবাইল `01XXXXXXXXX` (১১ সংখ্যা), Transaction ID কমপক্ষে ৮ অক্ষর — ভ্যালিডেশন আছে।
- ডাবল সাবমিট প্রতিরোধ করা হয়েছে (সাবমিট বোতাম লক)।
- অর্ডার ট্র্যাকে মোবাইলের শেষ ৪ সংখ্যা মিলতে হয়।
- কোনো সিক্রেট কোডে নেই — সব env var থেকে। `IMGBB_API_KEY` শুধু `api/upload-image.js` সার্ভারলেস ফাংশনে।

## জানা সীমা

- একটাই JS চাঙ্ক (Firebase + Router একসাথে থাকায়) — code-splitting পরে যোগ করা যায়।
- Firebase ছাড়া ডেমো মোডে ডেটা শুধু এক ব্রাউজারে থাকে; মাল্টি-ডিভাইস/আসল অর্ডারের জন্য Firebase বাধ্যতামূলক।
- ছবি আপলোড: ImgBB ফাংশন আছে, কিন্তু অ্যাডমিন প্রোডাক্ট ফর্মে এখন URL-ভিত্তিক নয় — প্রোডাক্ট আর্ট গ্রেডিয়েন্ট+SVG দিয়ে তৈরি (কোনো কপি করা ছবি নেই)।
- পেমেন্ট সম্পূর্ণ ম্যানুয়াল — bKash/Nagad-এর কোনো অটো-ভেরিফিকেশন API নেই।
