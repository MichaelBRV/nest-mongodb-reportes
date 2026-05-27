const fs = require('fs');
const path = require('path');

const schemasDir = path.join(process.cwd(), 'schemas');
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
  const filePath = path.join(schemasDir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  // Revert the wrong replacement
  content = content.replace("import { Types } from 'mongoose';\nconst ObjectId = Types.ObjectId;", "import { ObjectId } from 'src/config'");
  
  fs.writeFileSync(filePath, content);
});
console.log('Done reverting and fixing imports');
