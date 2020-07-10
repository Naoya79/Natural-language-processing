# .envファイルを読み込んで環境変数へ反映する
import os
from dotenv import load_dotenv

load_dotenv()
APPID = os.getenv('APPID')
