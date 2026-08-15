const fs = require('fs');

function replaceImage(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('AvatarImage')) return; // already done
  
  if (file === 'src/components/common/AvatarSelector.tsx') {
    content = content.replace("import { cn } from '@/lib/utils';", "import { cn } from '@/lib/utils';\nimport { AvatarImage } from './AvatarImage';");
  } else {
    content = content.replace("import { getAvatarByEmojiOrId } from '@/data/avatars';", "import { getAvatarByEmojiOrId } from '@/data/avatars';\nimport { AvatarImage } from '@/components/common/AvatarImage';");
  }
  
  content = content.replace(/<img src=\{([a-zA-Z0-9_.]+)\.image\} alt=\{([a-zA-Z0-9_.]+)\.name\} className="([^"]+)" \/>/g, '<AvatarImage src={$1.image} alt={$1.name} className="$3" />');
  
  fs.writeFileSync(file, content, 'utf8');
}

['src/components/common/AvatarSelector.tsx', 'src/pages/Profile.tsx', 'src/components/layout/TopNav.tsx', 'src/components/navigation/Sidebar.tsx'].forEach(replaceImage);
