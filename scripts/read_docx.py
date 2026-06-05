import docx
import sys

def read_docx(file_path):
    try:
        doc = docx.Document(file_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        print('\n'.join(full_text))
    except Exception as e:
        print(f"Error reading docx: {e}")

if __name__ == '__main__':
    read_docx(sys.argv[1])
