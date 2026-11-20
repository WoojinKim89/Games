# Inline images into one self-contained index.html
import base64,io,re,pathlib
from PIL import Image
d=pathlib.Path(__file__).parent
src=(d/'game.src.html').read_text()
def data(name):
    im=Image.open(d/f'{name}.png');buf=io.BytesIO();im.save(buf,'WEBP',quality=82)
    return 'data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
out=re.sub(r'IMG\.(\w+)"',lambda m:data(m.group(1))+'"',src)
(d/'index.html').write_text(out);print(len(out))
