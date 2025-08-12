import dbConnect from '@/lib/dbConnect';
import LearnableSkill from '@/models/LearnableSkill';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ error: 'File parsing error' });
    }

    try {
      const title = fields.title?.[0] || '';
      const description = fields.description?.[0] || '';
      const link = fields.link?.[0] || '';
      const postedBy = fields.postedBy?.[0] || '';
      const category = fields.category?.[0] || '';
      const pdfFile = files.pdf ? files.pdf[0] : null;
      const pdfUrl = pdfFile ? `/uploads/${path.basename(pdfFile.filepath)}` : null;

      console.log('Saving skill with:', { title, description, link, postedBy, category, pdf: pdfUrl });

      const newSkill = await LearnableSkill.create({
        title,
        description,
        link,
        postedBy,
        category,
        pdf: pdfUrl,
      });

      return res.status(201).json({ success: true, skill: newSkill });

    } catch (error) {
      console.error('❌ DB Save Error:', error.message || error);
      return res.status(500).json({ error: 'Server error while saving skill' });
    }
  });
}