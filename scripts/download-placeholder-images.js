const fs = require('fs');
const path = require('path');
const https = require('https');

// List of images to download
const images = [
  {
    name: 'modern-collaboration-space.png',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'modern-conference-room.png',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'quiet-office.png',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'modern-meeting-room.png',
    url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'modern-open-office.png',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'abstract-letter-aj.png',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'ed-initials-abstract.png',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'abstract-dw.png',
    url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'abstract-jm.png',
    url: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'monogram-mb.png',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'stylized-sw.png',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'road-trip-scenic-route.png',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop'
  }
];

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Download each image
images.forEach(image => {
  const filePath = path.join(publicDir, image.name);
  
  // Skip if file already exists and has content
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
    console.log(`Skipping ${image.name} - file already exists`);
    return;
  }
  
  console.log(`Downloading ${image.name}...`);
  
  https.get(image.url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${image.name}: ${response.statusCode}`);
      return;
    }
    
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded ${image.name}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${image.name}: ${err.message}`);
  });
});

console.log('Download process started. Check the console for progress.'); 