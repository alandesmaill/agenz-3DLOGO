#!/bin/bash
FILE="lib/works-data.ts"

# Fix hero images (line after "hero: {" contains coverImage)
sed -i '' '
/id: .techflow-rebrand/,/id: .organics-packaging/ {
  s|coverImage: .*|coverImage: '\''/images/works/hero/techflow-hero.jpg'\'',|
}
/id: .organics-packaging/,/id: .luxe-hotels-campaign/ {
  s|coverImage: .*|coverImage: '\''/images/works/hero/organics-hero.jpg'\'',|
}
/id: .luxe-hotels-campaign/,/id: .startupxyz-launch/ {
  s|coverImage: .*|coverImage: '\''/images/works/hero/luxe-hero.jpg'\'',|
}
/id: .startupxyz-launch/,/id: .regional-auto/ {
  s|coverImage: .*|coverImage: '\''/images/works/hero/startupxyz-hero.jpg'\'',|
}
/id: .regional-auto/,/id: .cascade-festival/ {
  s|coverImage: .*|coverImage: '\''/images/works/hero/regional-auto-hero.jpg'\'',|
}
/id: .cascade-festival/,/id: .ecotech-series/ {
  s|coverImage: .*|coverImage: '\''/images/works/hero/cascade-hero.jpg'\'',|
}
/id: .ecotech-series/,$ {
  s|coverImage: .*|coverImage: '\''/images/works/hero/ecotech-hero.jpg'\'',|
}
' "$FILE"

echo "✓ Fixed hero images"

# Fix gallery images - this is complex, skip for now and test with thumbnails
echo "Gallery images still need manual fix but should load"
echo "✅ Paths partially fixed - ready for testing"
