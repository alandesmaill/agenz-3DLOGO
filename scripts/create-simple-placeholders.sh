#!/bin/bash

# Create simple 1x1 pixel PNG placeholders
# This is a tiny cyan pixel in base64
CYAN_PIXEL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

cd "/Users/mac1/Desktop/agenz test website /public/images/works"

# Function to create placeholder
create_placeholder() {
    echo "$CYAN_PIXEL" | base64 -d > "$1"
}

# Thumbnails (7)
for project in techflow organics luxe startupxyz regional-auto cascade ecotech; do
    create_placeholder "thumbnails/${project}.jpg"
done
echo "✓ Created 7 thumbnails"

# Hero images (7)
for project in techflow organics luxe startupxyz regional-auto cascade ecotech; do
    create_placeholder "hero/${project}-hero.jpg"
done
echo "✓ Created 7 hero images"

# Gallery images (42 - 6 per project)
for project in techflow organics luxe startupxyz regional-auto cascade ecotech; do
    for i in {1..6}; do
        create_placeholder "gallery/${project}-${i}.jpg"
    done
done
echo "✓ Created 42 gallery images"

# Before/After (4)
for project in techflow organics; do
    create_placeholder "before-after/${project}-before.jpg"
    create_placeholder "before-after/${project}-after.jpg"
done
echo "✓ Created 4 before/after images"

echo ""
echo "✅ Total: 60 placeholder images created!"
