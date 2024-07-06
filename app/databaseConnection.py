import pymysql
import os
from dotenv import load_dotenv

def ConnectToDb():
    """
        Returns the connection object after obtaining the connection from the cloud database
    """
    load_dotenv()
    TIMEOUT = int(os.getenv("TIMEOUT"))
    CHARSET=str(os.getenv("CHARSET"))
    DB=str(os.getenv("DB"))
    HOST=str(os.getenv("HOST"))
    USER=str(os.getenv("USER"))
    PASSWORD=str(os.getenv("PASSWORD"))
    PORT=int(os.getenv("PORT"))
    
    connection = pymysql.connect(
        charset=CHARSET,
        connect_timeout=TIMEOUT,
        db=DB,
        host=HOST,
        password=PASSWORD,
        read_timeout=TIMEOUT,
        port=PORT,
        user=USER,
        write_timeout=TIMEOUT,
    )
    
    return connection