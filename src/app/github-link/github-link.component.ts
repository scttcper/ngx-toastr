import { Component, Input } from '@angular/core';

@Component({
  selector: 'github-link',
  styles: [`
  .githubLink {
    text-decoration: none;
  }
  .githubLink img {
    width: 36px;
  }
  `],
  template: `
  <a class="githubLink {{className}}"
    [href]="href(username, repo)"
  >
    <img alt="Github mark" src="./assets/github-icon.svg" />
  </a>
  `,
})
export class GithubLinkComponent {
  @Input() className = '';
  @Input() username = 'scttcper';
  @Input() repo = 'ngx-toastr';
  // githubIcon = githubIcon;
  constructor() { }

  href(username, repo) {
    return `https://github.com/${username}/${repo}`;
  }
}
