import mongoose from 'mongoose';

const LearnableSkillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    pdf: {
      type: String, // 👈 Store file path like "/uploads/file.pdf"
    },
    postedBy: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Python',
        'Web Development',
        'Data Science',
        'Networking',
        'Mobile Development',
        'Cybersecurity',
        'Others',
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.LearnableSkill ||
  mongoose.model('LearnableSkill', LearnableSkillSchema);