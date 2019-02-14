import { copySync } from 'fs-extra';
import { build } from 'ng-packagr';
import { join } from 'path';
import * as rimraf from 'rimraf';

async function main() {
  // cleanup dist
  rimraf.sync(join(process.cwd(), '/dist'));

  // build packages
  await build({
    project: join(process.cwd(), 'src/lib/package.json'),
  });

  // copy everything else
  copySync('README.md', join(process.cwd(), 'dist/README.md'));
  copySync('LICENSE', join(process.cwd(), 'dist/LICENSE'));
  copySync(
    join(process.cwd(), 'src/lib/toastr-bs4-alert.scss'),
    join(process.cwd(), 'dist/toastr-bs4-alert.scss'),
  );
  copySync(
    join(process.cwd(), 'src/lib/toastr.css'),
    join(process.cwd(), 'dist/toastr.css'),
  );
  copySync(
    join(process.cwd(), 'src/lib/toastr-old.css'),
    join(process.cwd(), 'dist/toastr-old.css'),
  );
}

main()
  .then(() => console.log('success'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
