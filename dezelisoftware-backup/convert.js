const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const POST_IDS = [1, 3, 4, 5, 6, 7, 8];
const PROJECT_IDS = [1, 2, 3];

function slugify(s) {
  return s
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80);
}

function yamlEscape(s) {
  return String(s == null ? '' : s).replace(/"/g, '\\"');
}

function convertPost(id) {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'posts', 'json', `post-${id}.json`), 'utf8'));
  const d = raw.data;
  const title = d.title || `post-${id}`;
  const category = (d.category && d.category.name) || '';
  const created = d.created_at || d.createdAt || '';
  const updated = d.updated_at || d.updatedAt || '';
  const content = d.content || '';

  const md = [
    '---',
    `id: ${id}`,
    `type: post`,
    `title: "${yamlEscape(title)}"`,
    `category: "${yamlEscape(category)}"`,
    `created_at: "${created}"`,
    `updated_at: "${updated}"`,
    '---',
    '',
    `# ${title}`,
    '',
    content,
    ''
  ].join('\n');

  const fname = `${id}-${slugify(title)}.md`;
  fs.writeFileSync(path.join(ROOT, 'posts', 'markdown', fname), md, 'utf8');
  return { id, title, category, created, fname };
}

function convertProfile() {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'profile', 'profile.json'), 'utf8'));
  const d = raw.data;
  const name = d.name || '';
  const slogan = d.slogan || '';
  const introduction = d.introduction || '';
  const contactEmail = d.contact_email || '';
  const profileImage = d.profile_image || '';
  const logoImage = d.logo_image || '';
  const skills = Array.isArray(d.skills) ? d.skills.map(s => s.name) : [];

  const md = [
    '---',
    `type: profile`,
    `name: "${yamlEscape(name)}"`,
    `slogan: "${yamlEscape(slogan)}"`,
    `contact_email: "${yamlEscape(contactEmail)}"`,
    `profile_image: "${yamlEscape(profileImage)}"`,
    `logo_image: "${yamlEscape(logoImage)}"`,
    `skills: [${skills.map(s => `"${yamlEscape(s)}"`).join(', ')}]`,
    '---',
    '',
    `# ${name}`,
    '',
    `> ${slogan}`,
    '',
    `**Contact**: ${contactEmail}`,
    '',
    `**Skills**: ${skills.join(', ')}`,
    '',
    introduction,
    ''
  ].join('\n');

  fs.writeFileSync(path.join(ROOT, 'profile', 'profile.md'), md, 'utf8');
  return { name, slogan, contactEmail, skills };
}

function convertProject(id) {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'projects', 'json', `project-${id}.json`), 'utf8'));
  const d = raw.data;
  const title = d.title || `project-${id}`;
  const techStacks = Array.isArray(d.tech_stacks) ? d.tech_stacks.map(t => t.name) : [];
  const startDate = d.start_date || '';
  const endDate = d.end_date || '';
  const thumbnail = d.thumbnail || '';
  const description = d.description || '';

  const md = [
    '---',
    `id: ${id}`,
    `type: project`,
    `title: "${yamlEscape(title)}"`,
    `tech_stacks: [${techStacks.map(t => `"${yamlEscape(t)}"`).join(', ')}]`,
    `start_date: "${startDate}"`,
    `end_date: "${endDate}"`,
    `thumbnail: "${yamlEscape(thumbnail)}"`,
    '---',
    '',
    `# ${title}`,
    '',
    `**기간**: ${startDate} ~ ${endDate}`,
    '',
    `**기술 스택**: ${techStacks.join(', ')}`,
    '',
    description,
    ''
  ].join('\n');

  const fname = `${id}-${slugify(title)}.md`;
  fs.writeFileSync(path.join(ROOT, 'projects', 'markdown', fname), md, 'utf8');
  return { id, title, techStacks, startDate, endDate, fname };
}

const postResults = POST_IDS.map(convertPost);
const projectResults = PROJECT_IDS.map(convertProject);
const profileResult = convertProfile();

const lines = [
  '# dezelisoftware.com Backup',
  '',
  `백업 일자: ${new Date().toISOString().slice(0, 10)}`,
  '',
  '## Profile',
  '',
  `- **이름**: ${profileResult.name}`,
  `- **슬로건**: ${profileResult.slogan}`,
  `- **이메일**: ${profileResult.contactEmail}`,
  `- **스킬 수**: ${profileResult.skills.length}`,
  `- 상세: [profile/profile.md](profile/profile.md)`,
  '',
  '## Blog Posts',
  '',
  '| ID | 카테고리 | 제목 | 작성일 |',
  '| --- | --- | --- | --- |',
  ...postResults.map(p => `| ${p.id} | ${p.category} | [${p.title}](posts/markdown/${p.fname}) | ${(p.created || '').slice(0, 10)} |`),
  '',
  '## Projects',
  '',
  '| ID | 제목 | 기술 스택 | 기간 |',
  '| --- | --- | --- | --- |',
  ...projectResults.map(p => `| ${p.id} | [${p.title}](projects/markdown/${p.fname}) | ${p.techStacks.join(', ')} | ${p.startDate} ~ ${p.endDate} |`),
  ''
];

fs.writeFileSync(path.join(ROOT, 'README.md'), lines.join('\n'), 'utf8');

console.log(`profile: 1, posts: ${postResults.length}, projects: ${projectResults.length}`);
console.log('  profile profile.md');
postResults.forEach(p => console.log('  post', p.fname));
projectResults.forEach(p => console.log('  project', p.fname));
console.log('wrote README.md');
