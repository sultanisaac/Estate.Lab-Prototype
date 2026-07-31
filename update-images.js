const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/data/properties.ts');
let content = fs.readFileSync(file, 'utf8');

const photoIds = [
  '1600210492486-724fe5c67fb0', '1556910103-1c02745aae4d', 
  '1616594039964-ae9021a400a0', '1620626011761-996317b8d101', '1593696140826-c58b021acf8b', 
  '1584622650111-993a426fbf0a', '1512917774080-9991f1c4c750', '1523217582562-09d0def993a6',
  '1600585154340-be6161a56a0c', '1600607687920-4e2a09cf159d', '1600566753190-17f0baa2a6c3',
  '1512915922686-57c11dde9b6b', '1600573472550-8090b5e0745e', '1580587771525-78b9dba3b914',
  '1502672260266-1c1b561c28ec', '1497366216548-37526070297c', '1484154218962-a197022b5858',
  '1513694203232-719a280e022f', '1493809842364-432a67e45293', '1495433324511-bf8e926a5704',
  '1501876725168-0020a30f48f7', '1512918580421-6c84c1f6057a', '1480074568708-e8b5c0103784',
  '1564013799919-ab600027ffc6', '1618219908412-a29a1bb7b86e', '1618220179428-22790b46a018',
  '1600607688969-ce561dc3b5c3', '1600607687644-88452140bb0d', '1600585154340-be6161a56a0c'
];

function getRandomId() {
  return photoIds[Math.floor(Math.random() * photoIds.length)];
}

const regex = /images:\s*\{\s*\.\.\.defaultImages,\s*exterior:\s*'([^']+)'\s*\}/g;

content = content.replace(regex, (match, exteriorUrl) => {
  return \`images: {
      exterior: '\${exteriorUrl}',
      livingRoom: 'https://images.unsplash.com/photo-\${getRandomId()}?auto=format&fit=crop&q=80&w=800',
      kitchen: 'https://images.unsplash.com/photo-\${getRandomId()}?auto=format&fit=crop&q=80&w=800',
      masterBed: 'https://images.unsplash.com/photo-\${getRandomId()}?auto=format&fit=crop&q=80&w=800',
      bath: 'https://images.unsplash.com/photo-\${getRandomId()}?auto=format&fit=crop&q=80&w=800',
      multifunction: 'https://images.unsplash.com/photo-\${getRandomId()}?auto=format&fit=crop&q=80&w=800',
      outdoor: 'https://images.unsplash.com/photo-\${getRandomId()}?auto=format&fit=crop&q=80&w=800'
    }\`;
});

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated all 15 properties with unique interior image URLs!');
