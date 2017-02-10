#!/bin/bash

yarn build
yarn global add angular-cli-ghpages
angular-cli-ghpages --repo=https://GH_TOKEN@github.com/scttcper/ngx-toastr.git --name="scttcper" --email=scttcper@gmail.com
