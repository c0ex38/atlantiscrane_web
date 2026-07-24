import sys

with open("frontend/src/app/admin/home/page.tsx", "r") as f:
    content = f.read()

with open("frontend/scratch.tsx", "r") as f:
    scratch_content = f.read()

content = content.replace(
    "const about = currentContent.about || {};",
    "const about = currentContent.about || {};\n  const history = currentContent.history || {};\n  const standards = currentContent.standards || {};\n  const exportNetwork = currentContent.exportNetwork || {};"
)

content = content.replace(
    "        {/* Save Button */}",
    scratch_content + "\n        {/* Save Button */}"
)

with open("frontend/src/app/admin/home/page.tsx", "w") as f:
    f.write(content)
