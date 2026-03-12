## 📝 API Payload Structure

4 tipe pertanyaan yang tersedia (`text`, `rating`, `single_choice`, `multiple_choice`).

### 1. Payload: Create / Update Form (Sisi Admin)

- **Trigger:** Saat Admin klik tombol "Publish Form".
- **Target Endpoint (Rencana):** `POST /api/forms`
- **Format JSON:**

```json
{
  "title": "Feedback Pengalaman Website",
  "slug": "web-experience-feedback",
  "questions": [
    {
      "id": "e4b9a12c-xxxx-xxxx",
      "type": "single_choice",
      "text": "Bagaimana pengalaman Anda menggunakan navigasi menu di website ini?",
      "required": true,
      "options": ["Sangat Mudah", "Cukup Mudah", "Membingungkan"]
    },
    {
      "id": "a1b2c3d4-xxxx-xxxx",
      "type": "multiple_choice",
      "text": "Fitur apa saja yang paling sering Anda gunakan di portal ini?",
      "required": false,
      "options": ["Tes Psikologi", "Laporan Hasil", "Artikel / Blog", "Live Chat"]
    },
    {
      "id": "x9y8z7w6-xxxx-xxxx",
      "type": "rating",
      "text": "Seberapa puas Anda dengan kecepatan muat (loading) halaman kami?",
      "required": true
    },
    {
      "id": "f8c3d71a-xxxx-xxxx",
      "type": "text",
      "text": "Apakah ada kendala (bug) atau saran fitur yang ingin Anda sampaikan?",
      "required": false
    }
  ]
}
```
