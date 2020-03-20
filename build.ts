import * as del from 'del';
import { copyFileSync } from 'fs';
import { build } from 'ng-packagr';
import { join } from 'path';

async function main() {
  // cleanup dist
  del.sync(join(process.cwd(), '/dist'));

  // build packages
  await build({
    project: join(process.cwd(), 'src/lib/package.json'),
  });

  // copy everything else
  copyFileSync('README.md', join(process.cwd(), 'dist/README.md'));
  copyFileSync('LICENSE', join(process.cwd(), 'dist/LICENSE'));
  copyFileSync(
    join(process.cwd(), 'src/lib/toastr-bs4-alert.scss'),
    join(process.cwd(), 'dist/toastr-bs4-alert.scss'),
  );
  copyFileSync(
    join(process.cwd(), 'src/lib/toastr.css'),
    join(process.cwd(), 'dist/toastr.css'),
  );
  copyFileSync(
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
