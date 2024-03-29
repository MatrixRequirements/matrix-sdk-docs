#!/bin/sh

# Article 1
node list-projects.js
node get-item-ids.js
node get-project-tree.js
node characterize-projects.js
node get-one-item.js

# Article 2
node partial-search-1.js
node partial-search-2.js
node partial-search-3.js
node partial-search-4.js
node partial-search-5.js
node search-fetchlog.js

# Article 3
node relationships.js
node change-downlink.js
node bad-set-label.js
node set-labels.js
# node create-uc.js   This one doesn't delete the record it creates, don't run it
node create-uc-cleanup.js
node upload-image.js
node place-image.js
node get-attachments.js
node upload-file-manager.js

# FAQ
node todos.js
node server-setting.js
node execute-call.js
node get-doc-8.js
node get-doc-8-moredetail.js
node get-doc-8-pdf.js