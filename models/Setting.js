import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Kartik Soni - Personal Portfolio & CMS'
  },
  metaTitle: {
    type: String,
    default: 'Kartik Soni | Senior Full Stack Developer & UI/UX Architect'
  },
  metaDescription: {
    type: String,
    default: 'Personal Portfolio & Blog of Kartik Soni, Senior Full Stack Node.js & React Developer.'
  },
  keywords: {
    type: String,
    default: 'Kartik Soni, Portfolio, Node.js Developer, Web Development, Full Stack'
  },
  contactEmail: {
    type: String,
    default: 'kartiksoni543@gmail.com'
  },
  githubUrl: {
    type: String,
    default: 'https://github.com'
  },
  linkedinUrl: {
    type: String,
    default: 'https://linkedin.com'
  },
  twitterUrl: {
    type: String,
    default: 'https://twitter.com'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
export default Setting;
