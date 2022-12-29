(async () => {
  const execa = await import("execa");
  const inquirer = await import("inquirer");
  const ci = require("miniprogram-ci");
  const projectJson = require("./project.config.json");
  const version = require("./version");
  // check in main branch
  const curbranch = getGitBranch();
  if (curbranch !== "main" && curbranch !== "master") {
    console.log("\x1b[41m%s\x1b[0m", "请在主分支发布");
    return;
  }

  // diff code with remote and pull code
  execa.execaCommandSync("git remote update");
  const statusRes = execa.execaCommandSync("git status -uno");
  if (statusRes.stdout.includes("behind")) {
    console.log("\x1b[41m%s\x1b[0m", "当前版本落后于远程分支，请拉取");
    const confirm = await inquirer.default.prompt([
      {
        type: "confirm",
        name: "pull",
        message: `是否拉取远程分支？`,
        default: true
      }
    ]);
    if (confirm.pull) {
      execa.execaCommandSync("git pull");
    }
    return;
  }

  // input description about git and mini-programer
  let comment = getGitLastMsg("%an/%cd/%s");
  const answer = await inquirer.default.prompt([
    {
      type: "string",
      name: "comment",
      message: `请输入新版本项目描述，默认为（${comment}）`,
      default: comment
    }
  ]);
  comment = answer.comment;

  // update version
  version.updateVersion();

  // check the code enters the repository
  const res = execa.execaCommandSync("git diff");
  if (res.stdout) {
    const lastComment = getGitLastMsg("%s");
    execa.execaCommandSync(`git add .`);
    execa.execaSync("git", ["commit", "-m", lastComment]);
    console.log("\x1b[42m%s\x1b[0m", "代码提交至本地仓库");
  }

  function getGitBranch() {
    const res = execa.execaCommandSync("git rev-parse --abbrev-ref HEAD");
    return res.stdout;
  }

  function getGitLastMsg(format) {
    const res = execa.execaCommandSync(`git log --pretty=format:${format} -1`);
    return res.stdout;
  }

  const project = new ci.Project({
    appid: projectJson.appid,
    type: "miniProgram",
    projectPath: projectJson.miniprogramRoot,
    privateKeyPath: "private.mini.key",
    ignores: ["node_modules/**/*"],
    robot: 1
  });
  const uploadResult = await ci.upload({
    project,
    version: version.getVersion(),
    desc: comment,
    setting: {
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
      minify: true
    },
    onProgressUpdate: () => {
      console.log("\x1b[36m%s\x1b[0m", "building...");
    }
  });
  if (uploadResult) {
    const res = execa.execaCommandSync("git push");
    console.log("\x1b[42m%s\x1b[0m", "小程序版本更新成功");
    console.log("\x1b[42m%s\x1b[0m", "代码推送至远程仓库");
  }
})();
