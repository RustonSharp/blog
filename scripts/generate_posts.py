import os
import json
import re
from datetime import datetime

# Configuration
POSTS_DIR = 'posts'
OUTPUT_FILE = 'data/posts.json'

def parse_frontmatter(content):
    """Parses standard YAML-like frontmatter from a markdown string."""
    frontmatter = {}
    body = content
    
    # Check if the file starts with frontmatter delimiters
    if content.startswith('---'):
        # Find the end of the frontmatter
        end_idx = content.find('\n---', 3)
        if end_idx != -1:
            frontmatter_str = content[3:end_idx].strip()
            # Extract key-value pairs
            for line in frontmatter_str.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip()
            
            # The rest is the body
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

def main():
    posts_data = []
    
    # Ensure the posts directory exists
    if not os.path.exists(POSTS_DIR):
        print(f"Directory '{POSTS_DIR}' not found. Please create it and add markdown files.")
        return

    # Process each markdown file in the posts directory
    for filename in os.listdir(POSTS_DIR):
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
    posts_data.sort(key=lambda x: parse_date_for_sort(x.get('date', '')), reverse=True)

    # Write the output JSON
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(posts_data, f, ensure_ascii=False, indent=4)
        print(f"\nSuccessfully generated {OUTPUT_FILE} with {len(posts_data)} posts.")
    except Exception as e:
        print(f"Error writing to {OUTPUT_FILE}: {e}")

if __name__ == "__main__":
    main()
