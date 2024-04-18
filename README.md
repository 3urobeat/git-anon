<div align="center">
    <p align="center"><img width=45% src=".github/img/logo.png"></p>
    <h4>📊 Track personal commit statistics without sharing company code!</h4>
    <div>
        <a href="#owo-whats-this">Introduction</a> •
        <a href="#installation">Installation</a> •
        <a href="#configuration">Configuration</a>
    </div>
    <!-- <img src="./.github/img/demo.png"> -->
</div>

&nbsp;

# 👀 OwO, what's this?
Git Anon is a selfhosted webservice, which allows you to keep track of your personal git commits at work, without ever sharing any code itself.  

Git Anon presents you with a webinterface to input a commit message, modify the commit date and specify a line diff for every file.  
Once pressing commit, the service produces your specified line diff by generating random characters, makes the commit and pushes it to your remote repository.  
GitHub automatically detects the programming languages of your line diffs based on file extension and will show the generated commit as a contribution on your profile, even when the repository is private.

<p align="center"><img width=90% src=".github/img/preview.png"></p>

&nbsp;

# 🚀 Installation
### Docker (recommended):
TBA

&nbsp;

### Local:
TBA

&nbsp;

**Note:**  
No matter which method you chose, make sure to protect the service.  
You'll very probably want to expose the service to the outside to be able to access it from your phone when at work.  
Git Anon does not provide any authentication itself, so you should either enable a password protection in your reverse proxy - or even better - put it behind a VPN.

&nbsp;

# ⚡ Configuration
### Settings
Open the webpage in your browser and head to the `Settings` page.  

Set your `Name` and `Email` to use for every commit. For GitHub to contribute the commit to your account, the email must be your GitHub Email (this usually looks like `id+username@users.noreply.github.com`).  

Create a new private repository on your GitHub profile. This will be used by Git Anon to push your commits to.
Set the URL to this repository at `Remote URL` and provide your GitHub username at `Username`.  

You now have to create an access token to this specific repository, so that Git Anon can authenticate itself and push to it.  
Click [here](https://github.com/settings/personal-access-tokens/new) and create a new token. Increase the expiration, select the specific repository and grant `Read and Write` access to the `Content` permission.  
Confirm and copy the new token to the `Password/Access Token` field on the Git Anon settings page.  

Please make sure to use a fine grained token specifically for this repository, with only the permission explained above. This ensures that should your token get leaked, a potential attacker has no relevant access to your account.

> [!NOTE]  
> You do not have to use GitHub, it is just used here as it is the most popular option. If you use another service, it must use the same remote URL formatting for the guided settings mode to work. GitHub uses this format:  
> `https://username:password@domain.tld/path/to/repo.git`

At last, check the checkbox `Push commits to remote` so that Git Anon pushes your commits to the remote repository.  
If you want to keep your repository local (for whatever reason), you can also leave it unchecked and ignore the access token explanation from above.

**Do not forget to click `✅ Save`!**

&nbsp;

### Projects
Click on `Projects` in the navbar.  
This is where you configure your different projects you want to track.

Create a new Project, give it a fitting name and add however many files you want to track at the right.  
I recommend creating one file for every programming language used in that project. If JavaScript, HTML and CSS are used, create a file called `Main.js`, one `Main.html` and one `Main.css`.  
GitHub automatically detects the programming language by looking at the file extension.

Click `✅ Save`.

When you now go to the `Home` page, you can select your project and provide a line diff for every file you have just created.
