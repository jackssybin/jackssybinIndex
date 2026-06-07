const util = require("util");
const child_process = require("child_process");
const exec = util.promisify(child_process.exec);

function pad(value) {
  return String(value).padStart(2, "0");
}

function slugify(value) {
  return String(value || "post")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "") || "post";
}

module.exports = async function () {
  const title = await app.plugins.plugins.quickadd.api.inputPrompt("文章标题");
  if (!title) return;
  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const slug = slugify(title);
  const target = "content/articles/" + year + "/" + month + "/" + day + "/" + slug + ".md";
  const command = "hugo new " + target;
  const { stderr } = await exec(command, { cwd: app.fileManager.vault.adapter.basePath });
  if (stderr) new Notice(stderr);
  new Notice("New Blog Created: " + target);
};
