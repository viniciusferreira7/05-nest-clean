# [1.6.0](https://github.com/viniciusferreira7/05-nest-clean/compare/v1.5.0...v1.6.0) (2025-10-17)


### Bug Fixes

* correct tests to fetch question comments ([387390a](https://github.com/viniciusferreira7/05-nest-clean/commit/387390a32fd8325dbd2537094b5634f7940e6c5f))


### Features

* add comment with author presenter ([1206d94](https://github.com/viniciusferreira7/05-nest-clean/commit/1206d941dc92b14ed1f10c0c0d6ecdce5b988801))
* create method to find many question comments with author ([52ec943](https://github.com/viniciusferreira7/05-nest-clean/commit/52ec943a6f98500000056053ae878e2dfb3909db))
* create prisma comment with author mapper ([ee374b1](https://github.com/viniciusferreira7/05-nest-clean/commit/ee374b129288ec4661c44d9fad2e8a323e06b3e6))

# [1.5.0](https://github.com/viniciusferreira7/05-nest-clean/compare/v1.4.0...v1.5.0) (2025-10-10)


### Features

* create comment with author class ([8cf7c6d](https://github.com/viniciusferreira7/05-nest-clean/commit/8cf7c6de8ae94736a61858c5d649a8414bafdd70))

# [1.4.0](https://github.com/viniciusferreira7/05-nest-clean/compare/v1.3.0...v1.4.0) (2025-10-10)


### Features

* add core value object ([2dc3abe](https://github.com/viniciusferreira7/05-nest-clean/commit/2dc3abedd928e6be0999c7e390373279314dcade))

# [1.3.0](https://github.com/viniciusferreira7/05-nest-clean/compare/v1.2.0...v1.3.0) (2025-10-07)


### Features

* add attachments on creating or editing answer ([7e91072](https://github.com/viniciusferreira7/05-nest-clean/commit/7e910722afd998eba879828be8402cb8a286ac64))
* add attachments on editing question ([03d6c43](https://github.com/viniciusferreira7/05-nest-clean/commit/03d6c437be5bbbea80ab358a1028abe4d3103541))

# [1.2.0](https://github.com/viniciusferreira7/05-nest-clean/compare/v1.1.0...v1.2.0) (2025-10-03)


### Bug Fixes

* correct unit test to remove and add question attachment ([6641983](https://github.com/viniciusferreira7/05-nest-clean/commit/66419837156bbf942f9a861ef7a779521eb5c3ff))


### Features

* add feature to create question with attachments ([bf9b496](https://github.com/viniciusferreira7/05-nest-clean/commit/bf9b4964e8e0b0ef3b99e934be3c55feea689cea))
* implement missed methods on prisma question attachments repository ([847c983](https://github.com/viniciusferreira7/05-nest-clean/commit/847c983a71c3d2d74f871e2e5da810bd9c6ccd2c))
* implements update and delete many on prisma question attachments mapper ([28b40d8](https://github.com/viniciusferreira7/05-nest-clean/commit/28b40d8563c06bf9302742138e088ade6300e08a))

# [1.1.0](https://github.com/viniciusferreira7/05-nest-clean/compare/v1.0.0...v1.1.0) (2025-09-24)


### Features

* add r2 storage class ([71082ce](https://github.com/viniciusferreira7/05-nest-clean/commit/71082ce2a0177d7c5c8ede308dd893d430f0afe5))
* create storage module ([418a3c5](https://github.com/viniciusferreira7/05-nest-clean/commit/418a3c598478f844314edc240f4b7fcc693b99d4))
* implements upload to r2 storage ([5530b27](https://github.com/viniciusferreira7/05-nest-clean/commit/5530b272024970674660d65e926bfd52be6ec66c))

# [1.1.0](https://github.com/viniciusferreira7/05-nest-clean/compare/v1.0.0...v1.1.0) (2025-09-24)


### Features

* add r2 storage class ([71082ce](https://github.com/viniciusferreira7/05-nest-clean/commit/71082ce2a0177d7c5c8ede308dd893d430f0afe5))
* create storage module ([418a3c5](https://github.com/viniciusferreira7/05-nest-clean/commit/418a3c598478f844314edc240f4b7fcc693b99d4))
* implements upload to r2 storage ([5530b27](https://github.com/viniciusferreira7/05-nest-clean/commit/5530b272024970674660d65e926bfd52be6ec66c))

# 1.0.0 (2025-09-13)


## Bug Fixes

* add missing imports to http module ([ff6d234](https://github.com/viniciusferreira7/05-nest-clean/commit/ff6d2342b35609c872ea348fb6ebb03e219c2dbd))
* correct database url when is used into e2e test ([5400ee6](https://github.com/viniciusferreira7/05-nest-clean/commit/5400ee6f320fb09e8df5e07450784328941993d8))


## Features

* add abstract class to upload attachment ([ae8c32a](https://github.com/viniciusferreira7/05-nest-clean/commit/ae8c32ae0673168dbb54aa600f8bf68503783b9d))
* add authentication with private and public jwt ([25c6a4f](https://github.com/viniciusferreira7/05-nest-clean/commit/25c6a4f963153c3046fac00208a1f8e767cc10e1))
* add base structure of controller to upload attachment ([30f6c3f](https://github.com/viniciusferreira7/05-nest-clean/commit/30f6c3f13a8e6103bda1875a71878dbd2a9eac2f))
* add comments and attachments schema ([72a172b](https://github.com/viniciusferreira7/05-nest-clean/commit/72a172b1b046e61b665a7264390d3afae50d4d9a))
* add controller to answer question ([96848f9](https://github.com/viniciusferreira7/05-nest-clean/commit/96848f96deb8bdadfe0a92cbc6cda3b4a7d4956c))
* add controller to choose question best answer ([0c9df86](https://github.com/viniciusferreira7/05-nest-clean/commit/0c9df86db53f77b26e66a71e9200ab88400f6538))
* add controller to comment on questionr ([c53123d](https://github.com/viniciusferreira7/05-nest-clean/commit/c53123d15be67451da35a442ba52e447d0deb9f3))
* add controller to create answer comment ([fa9e247](https://github.com/viniciusferreira7/05-nest-clean/commit/fa9e247cd049a9c08d1272c35484b69efb4e40a7))
* add controller to delete answer comment ([7f0d6ff](https://github.com/viniciusferreira7/05-nest-clean/commit/7f0d6ff88a51571261a6024c8ab39e33b248b694))
* add controller to delete question comment ([1dcfffa](https://github.com/viniciusferreira7/05-nest-clean/commit/1dcfffaa57964c42791f190a410bc6f4d4a481c6))
* add controller to fetch answer comments ([3a01b13](https://github.com/viniciusferreira7/05-nest-clean/commit/3a01b130357c419ed324e1e59f2c2dd64a69837b))
* add controller to fetch question comments ([ce9e694](https://github.com/viniciusferreira7/05-nest-clean/commit/ce9e694fe75e7435fe6b4b959c3af4359c19e58a))
* add controller to fetch recent questions ([e6459a4](https://github.com/viniciusferreira7/05-nest-clean/commit/e6459a45526006cec28545ad86669ea67c4d725d))
* add controller to get question by slug ([fe725ea](https://github.com/viniciusferreira7/05-nest-clean/commit/fe725ea43dc1750630527c27e0fb706ffdac4e5e))
* add core domain in this project ([3bdd4f7](https://github.com/viniciusferreira7/05-nest-clean/commit/3bdd4f799d5cd20e2ece0364d89a17b7ea1d9b3f))
* add delete answer controller ([f4c3cec](https://github.com/viniciusferreira7/05-nest-clean/commit/f4c3cec503eac7ed3214b2dc2f32eb1d3e98e666))
* add domains ([b9721aa](https://github.com/viniciusferreira7/05-nest-clean/commit/b9721aa560942e44858238705bf4b6efdf1fbf43))
* add edit answer controller ([f7720b8](https://github.com/viniciusferreira7/05-nest-clean/commit/f7720b8dd3bec4cf9d58b5ad76f5a301218a3b48))
* add factories to insert data into database ([58b42cb](https://github.com/viniciusferreira7/05-nest-clean/commit/58b42cbeeb55db895a38df3cab459d65c9b75225))
* add fetch question answers controller ([d9034bf](https://github.com/viniciusferreira7/05-nest-clean/commit/d9034bfb6e5eda80864e6dc1658fa9287b740e35))
* add hash of password to save in database ([10143c5](https://github.com/viniciusferreira7/05-nest-clean/commit/10143c5223930f6ceb50e57e935819e63fe5c807))
* add in memoery students repository ([579ccd3](https://github.com/viniciusferreira7/05-nest-clean/commit/579ccd39b4f43551937748fb7fbe82fbe1f8efde))
* add jwt stragetegy ([2bb84de](https://github.com/viniciusferreira7/05-nest-clean/commit/2bb84de1173ee3073c085f2182b58a7c9e766dcf))
* add migration ([993b0e2](https://github.com/viniciusferreira7/05-nest-clean/commit/993b0e2f3b30e7ff075d6f50ef23e4fd974dc49a))
* add pipe using zod to validate requests ([2989c93](https://github.com/viniciusferreira7/05-nest-clean/commit/2989c93b5219c41f02e1dc7ff13c4fc16330eeb7))
* add prisma and create table users and questions ([a6c7436](https://github.com/viniciusferreira7/05-nest-clean/commit/a6c74365c70898cc2af05412a0be291e9e89edc3))
* add prisma answer comment mapper ([05ebe93](https://github.com/viniciusferreira7/05-nest-clean/commit/05ebe936e8e813f2aeceec67421a50cfb7de009b))
* add prisma answer mapper ([2e0b609](https://github.com/viniciusferreira7/05-nest-clean/commit/2e0b6096d3f4bfa610ec4ff0172498a43a4303b6))
* add prisma question comment mapper ([e72a356](https://github.com/viniciusferreira7/05-nest-clean/commit/e72a35697d20c8447eb855ba70c00010c5527863))
* add prisma repositories into database module ([cb98b7d](https://github.com/viniciusferreira7/05-nest-clean/commit/cb98b7ddb2bcc4f3102bc4d9b36204ac746cbbcf))
* add prisma service ([035de2d](https://github.com/viniciusferreira7/05-nest-clean/commit/035de2db7631ffbf52dd2c535a7e58a9d5cce58a))
* add prismma mappers to question attachemnt and answer attachment ([2a2215d](https://github.com/viniciusferreira7/05-nest-clean/commit/2a2215d510d8de55770e380d8da4c9d6ad41cf13))
* add route to create account ([5a6c6d6](https://github.com/viniciusferreira7/05-nest-clean/commit/5a6c6d6558b98d0a6ab13298c12054fe34306d3b))
* add use case to authenticate student ([8698bda](https://github.com/viniciusferreira7/05-nest-clean/commit/8698bda368dc88ec2a2b10310b808960134c81cf))
* add use case to register student ([d915994](https://github.com/viniciusferreira7/05-nest-clean/commit/d9159941cce62375d08e1d91d0ed9470881d937a))
* add zod to validate .env file ([9a5bfd9](https://github.com/viniciusferreira7/05-nest-clean/commit/9a5bfd94e198fe53ad2d53a8cff5b22245627555))
* complete flow to fetch recent questions ([8feb1f8](https://github.com/viniciusferreira7/05-nest-clean/commit/8feb1f81ee50ccd2ee3c8eb694319d20ffc90373))
* create answer schema and add user role ([7f57dc1](https://github.com/viniciusferreira7/05-nest-clean/commit/7f57dc1fdc813944edb11bbcbd43bbdb3668b23a))
* create app with nest ([f85ec83](https://github.com/viniciusferreira7/05-nest-clean/commit/f85ec8343c28c48db2302144895cf65b157b3763))
* create auth module to use jwt ([2f8b07b](https://github.com/viniciusferreira7/05-nest-clean/commit/2f8b07b46fd6c9242d062a788823e83b6c256007))
* create class to mapper prisma question to domain ([322bf46](https://github.com/viniciusferreira7/05-nest-clean/commit/322bf4609716c63a3c2d26ef33cd3d46d1bfd2da))
* create controller to edit question ([c3425db](https://github.com/viniciusferreira7/05-nest-clean/commit/c3425dbe2308bd4310b58eca947b70cd08a37c03))
* create controller to register question ([0d68f46](https://github.com/viniciusferreira7/05-nest-clean/commit/0d68f4615530577a12bdd5dbb20a30b54f46c548))
* create cryptographic stubs ([2d00f2b](https://github.com/viniciusferreira7/05-nest-clean/commit/2d00f2b2338e03faa62915c522b5625adbebd062))
* create decorator to get sub from request ([7b98cc8](https://github.com/viniciusferreira7/05-nest-clean/commit/7b98cc84b8d9972283115db559fab7d92c729ee6))
* create encryption gateways ([d46d441](https://github.com/viniciusferreira7/05-nest-clean/commit/d46d441788355f7e5ad4e0a1e0d0c61cef6e3134))
* create http question presenter ([43994a8](https://github.com/viniciusferreira7/05-nest-clean/commit/43994a8f8c33b0920b0881b9b6703ebc98550739))
* create question factory ([d8c3b7f](https://github.com/viniciusferreira7/05-nest-clean/commit/d8c3b7fbe71c03511f3915602cdcd9c4263b9db2))
* create student factory ([724f522](https://github.com/viniciusferreira7/05-nest-clean/commit/724f5225a2445737e87b66ca872eefddc468efa5))
* create use case to upload attachment ([308c94b](https://github.com/viniciusferreira7/05-nest-clean/commit/308c94b11471a8a3902883d2d042b70e9613f7d3))
* enable authentication globally ([ace39ea](https://github.com/viniciusferreira7/05-nest-clean/commit/ace39ea3dc28cc12ee1a2ebe74d73c04dd29a24b))
* implement all methods of prisma questions repository ([03f54ae](https://github.com/viniciusferreira7/05-nest-clean/commit/03f54aeec5fc4afdb103a9e13c90cd33cd5bce37))
* implement authenticate controller ([32ba1d1](https://github.com/viniciusferreira7/05-nest-clean/commit/32ba1d1950e8684f15a4e280c5d7042713e60fa2))
* implement cryptography module ([dc257b1](https://github.com/viniciusferreira7/05-nest-clean/commit/dc257b1c16917fb514fcfba99405dfceb54f9263))
* implement flow to create question ([eec386d](https://github.com/viniciusferreira7/05-nest-clean/commit/eec386d7b12302bc148507b660197bafe006701e))
* implement methods of prisma answer attachment repository ([82209a6](https://github.com/viniciusferreira7/05-nest-clean/commit/82209a6fbc4a852278ef53784e3629829ba89dcf))
* implement methods of prisma answer comment repository ([ce1db86](https://github.com/viniciusferreira7/05-nest-clean/commit/ce1db8600dc871c97f0c22457e3db314acada12c))
* implement methods of prisma answer repository ([a2ac2a4](https://github.com/viniciusferreira7/05-nest-clean/commit/a2ac2a4928765ef729dab4fbe8b8d2bdf312af5e))
* implement methods of prisma question attachment repository ([ed7f630](https://github.com/viniciusferreira7/05-nest-clean/commit/ed7f630e0c8492d305783df36f7f08d2e1208da1))
* implement methods of prisma question comment repository ([36cfd09](https://github.com/viniciusferreira7/05-nest-clean/commit/36cfd0921834a01e4d3baa5310314efe687b49d4))
* implement prisma repositories ([5bc94c3](https://github.com/viniciusferreira7/05-nest-clean/commit/5bc94c31b7f132fee1fac5db2915c8806a0c8a5c))
