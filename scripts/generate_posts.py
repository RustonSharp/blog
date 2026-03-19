import os
import json
import re
from datetime import datetime

# Configuration
POSTS_DIR = 'posts'
OUTPUT_FILE = 'data/posts.json'

def _parse_scalar(value):
    """Parse a scalar value from frontmatter."""
    if value is None:
        return None

    text = str(value).strip()
    if not text:
        return ''

    if (text.startswith('"') and text.endswith('"')) or (text.startswith("'") and text.endswith("'")):
        return text[1:-1]

    lower = text.lower()
    if lower in {'null', '~', 'none'}:
        return None
    if lower == 'true':
        return True
    if lower == 'false':
        return False

    return text


def _parse_inline_list(value):
    """Parse [a, b, c] into a Python list."""
    inner = value[1:-1].strip()
    if not inner:
        return []

    parts = []
    current = []
    quote = None
    for ch in inner:
        if quote:
            if ch == quote:
                quote = None
            else:
                current.append(ch)
            continue

        if ch in {"'", '"'}:
            quote = ch
        elif ch == ',':
            parts.append(''.join(current).strip())
            current = []
        else:
            current.append(ch)

    if current:
        parts.append(''.join(current).strip())

    return [_parse_scalar(part) for part in parts if str(part).strip()]


def _parse_frontmatter_block(frontmatter_str):
    """
    Parse a useful YAML subset:
    - key: value
    - key: [a, b, c]
    - key:
        - item1
        - item2
    - key: |
        multi line text
    """
    data = {}
    lines = frontmatter_str.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped or stripped.startswith('#'):
            i += 1
            continue

        if ':' not in line:
            i += 1
            continue

        key, raw_value = line.split(':', 1)
        key = key.strip()
        raw_value = raw_value.strip()

        # Block scalar
        if raw_value in {'|', '>'}:
            block = []
            i += 1
            while i < len(lines) and (lines[i].startswith(' ') or lines[i].startswith('\t')):
                block.append(lines[i].lstrip())
                i += 1
            data[key] = '\n'.join(block).strip()
            continue

        # Indented list after `key:`
        if raw_value == '':
            items = []
            j = i + 1
            while j < len(lines) and (lines[j].startswith(' ') or lines[j].startswith('\t')):
                child = lines[j].strip()
                if child.startswith('- '):
                    items.append(_parse_scalar(child[2:].strip()))
                j += 1

            data[key] = items if items else ''
            i = j
            continue

        # Inline list
        if raw_value.startswith('[') and raw_value.endswith(']'):
            data[key] = _parse_inline_list(raw_value)
            i += 1
            continue

        data[key] = _parse_scalar(raw_value)
        i += 1

    return data


def parse_frontmatter(content):
    """Parses frontmatter from markdown with a practical YAML subset."""
    frontmatter = {}
    body = content

    if content.startswith('---'):
        end_idx = content.find('\n---', 3)
        if end_idx != -1:
            frontmatter_str = content[3:end_idx].strip()
            frontmatter = _parse_frontmatter_block(frontmatter_str)
            body = content[end_idx + 4:].strip()

    return frontmatter, body

def estimate_reading_time(word_count):
    """Rough estimate of reading time (assume ~300 words per minute)."""
    minutes = max(1, round(word_count / 300))
    return f"{minutes} 分钟"

def parse_date_for_sort(date_str):
    """Parse date string into datetime for robust sorting."""
    if not isinstance(date_str, str):
        return datetime.min

    date_str = date_str.strip()
    supported_formats = [
        '%Y年%m月%d日',
        '%Y-%m-%d',
        '%Y/%m/%d',
        '%B %d, %Y',
        '%b %d, %Y'
    ]

    for fmt in supported_formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue

    print(f"Warning: Unrecognized date format '{date_str}', fallback to oldest.")
    return datetime.min

def parse_tags(tags_value, fallback_category=''):
    """Parse tags from frontmatter and return a normalized list."""
    value = str(tags_value or '').strip()
    if value.startswith('[') and value.endswith(']'):
        value = value[1:-1].strip()

    tags = []
    seen = set()
    for item in value.split(','):
        tag = item.strip().strip('"').strip("'")
        if not tag or tag in seen:
            continue
        seen.add(tag)
        tags.append(tag)

    category = str(fallback_category or '').strip()
    if not tags and category:
        tags.append(category)

    return tags

def main():
    posts_data = []
    
    # Ensure the posts directory exists
    if not os.path.exists(POSTS_DIR):
        print(f"Directory '{POSTS_DIR}' not found. Please create it and add markdown files.")
        return

    # Process each markdown file in the posts directory
    for filename in sorted(os.listdir(POSTS_DIR)):
        if filename.endswith('.md'):
            filepath = os.path.join(POSTS_DIR, filename)
            post_id = os.path.splitext(filename)[0]
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                frontmatter, body = parse_frontmatter(content)
                
                # If a file has no frontmatter, skip it or use defaults
                if not frontmatter:
                    print(f"Warning: No frontmatter found in {filename}, skipping.")
                    continue
                
                # Calculate word count roughly
                # Strip out basic markdown syntax to get plain words for counting
                plain_text = re.sub(r'[#*`_~>\[\]\(\)]', '', body)
                # Count CJK characters and english words
                cjk_chars = len(re.findall(r'[\u4e00-\u9fff]', plain_text))
                english_words = len(re.findall(r'\b[a-zA-Z]+\b', plain_text))
                total_words = cjk_chars + english_words
                word_count_str = f"{total_words} 字"
                
                # Build the post object based on frontmatter and calculated stats
                post = {
                    "id": post_id,
                    "title": frontmatter.get('title', 'Untitled'),
                    "subtitle": frontmatter.get('subtitle', ''),
                    "date": frontmatter.get('date', datetime.today().strftime('%Y年%m月%d日')),
                    "category": frontmatter.get('category', '未分类'),
                    "tags": parse_tags(frontmatter.get('tags', ''), frontmatter.get('category', '')),
                    "collection": frontmatter.get('collection', None),
                    "excerpt": frontmatter.get('excerpt', ''),
                    "file": filename,
                    "readTime": frontmatter.get('readTime', estimate_reading_time(total_words)),
                    "wordCount": frontmatter.get('wordCount', word_count_str),
                }
                
                if 'heroImage' in frontmatter and frontmatter['heroImage']:
                    post['heroImage'] = frontmatter['heroImage']
                    
                posts_data.append(post)
                print(f"Processed: {filename} -> {post['title']}")
                
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    # Sort posts by parsed date descending
    posts_data.sort(
        key=lambda x: (
            parse_date_for_sort(x.get('date', '')),
            str(x.get('id', ''))
        ),
        reverse=True
    )

    # Write the output JSON
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(posts_data, f, ensure_ascii=False, indent=4)
        print(f"\nSuccessfully generated {OUTPUT_FILE} with {len(posts_data)} posts.")
    except Exception as e:
        print(f"Error writing to {OUTPUT_FILE}: {e}")

if __name__ == "__main__":
    main()
