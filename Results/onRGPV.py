import requests
import os
import time
import re
import json
import sys
import threading
import collections
from bs4 import BeautifulSoup


def ensure_dir(directory):
    # directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

	


def validate(R_From,R_Upto):
	substr=R_Upto[0:-3]
	if substr in R_From:
		last_From=int(R_From[9:len(R_From)])
		last_Upto=int(R_Upto[9:len(R_Upto)])
		if last_From>0 and last_From<=last_Upto and last_Upto<=180:
			return True
	return False

def fetch_list(R_From,R_Upto):
	mylist=[]
	R_From=R_From.lower()
	R_Upto=R_Upto.lower()
	p=re.compile('^\d{4}[a-z]{2}\d{6}$')
	if p.match(R_From) and p.match(R_Upto) and validate(R_From,R_Upto):
		for i in range(int(R_From[9:len(R_From)]),int(R_Upto[9:len(R_Upto)])+1):
			mylist.append(R_Upto[0:-3]+str(i).zfill(3))
		return mylist
	else:
		print('InValid Input.')
		return None

def tryAgain(roll,sem,path,tno):

	customHeader_GET={'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
	'Cache-Control'	: 'max-age=0',
	'Host': 'result.rgpv.ac.in',
	'Upgrade-Insecure-Requests':'1',
	'DNT':'1'}
	r = requests.get('http://result.rgpv.ac.in/Result/BErslt.aspx',headers=customHeader_GET );


	sId=r.headers['Set-Cookie'].split(';')[0].split('=')[1]


	soup = BeautifulSoup(r.text, 'html.parser')
	cookie={'ASP.NET_SessionId': sId }

	v3 = soup.find(id="__VIEWSTATE")['value']
	v4 = soup.find(id="__VIEWSTATEGENERATOR")['value']
	v5 = soup.find(id="__EVENTVALIDATION")['value']
	imagepath = 'http://result.rgpv.ac.in/Result/'+soup.find_all('img')[1]['src']
	os.system('cmd /C curl -s '+imagepath+'>>a-'+tno+'.jpg ')
	os.system('cmd /C tesseract a-'+tno+'.jpg output-'+tno+' --oem 0 -l eng ')
	f1=open("output-"+tno+".txt","r")

	c=f1.read()[0:-2].lower()
	c=c.replace(" ","")
	f1.close()
	os.system('cmd /C del a-'+tno+'.jpg && del output-'+tno+'.txt')

	if(len(c)!=5):
		return tryAgain(roll,sem,path,tno)

	time.sleep(4)

	url='http://result.rgpv.ac.in/Result/BErslt.aspx'
	data={"__EVENTTARGET":"","__EVENTARGUMENT":"","__VIEWSTATE":v3,"__VIEWSTATEGENERATOR":v4,"__EVENTVALIDATION":v5,"ctl00$ContentPlaceHolder1$txtrollno":roll,"ctl00$ContentPlaceHolder1$drpSemester":sem,"ctl00$ContentPlaceHolder1$rbtnlstSType":"G","ctl00$ContentPlaceHolder1$TextBox1":c,"ctl00$ContentPlaceHolder1$btnviewresult":"View Result"}
	customHeader={'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
	'Cache-Control'	: 'max-age=0',
	'Connection':'close',
	'Host': 'result.rgpv.ac.in',
	'Origin':'http://result.rgpv.ac.in',
	'Referer':'http://result.rgpv.ac.in/Result/BErslt.aspx',
	'Upgrade-Insecure-Requests':'1',
	'DNT':'1'}
	r = requests.post( url,cookies=cookie,headers=customHeader, data = data )
	soup_res = BeautifulSoup(r.text, 'html.parser')

	if 'alert' in r.text:
		scripts=soup_res.find_all('script')
		newstr=str(scripts[len(scripts)-2])
		al_len=len(newstr)
		if(al_len==89):
			print("Not-Found on RGPV")
			return False;
		else:
			return tryAgain(roll,sem,path,tno)

	else:
		print("Found on RGPV")
		return True;
	

#.....MAIN ...............
try:
	args=sys.argv
	obj_list=[]
	tno=0
	mylist=fetch_list(args[1],args[2])
	if mylist:
		sem=args[3]
		if int(sem) in range(1,9):
			path='Data/CLG-'+str(mylist[0][0:4])+'/Batch-20'+str(int(mylist[0][6:8])+4)+'/'+str(mylist[0][4:6]).upper()+'/Sem-'+sem
			ensure_dir(path)
			
			for rnum in mylist:
				obj_list.append(threading.Thread(target=tryAgain, args=(rnum,sem,path,str(tno),)))
				tno=tno+1
				
			temp_list=[]
			for obj in obj_list:
				obj.start()
				temp_list.append(obj)
				
			for tobj in temp_list:
				tobj.join()
			
			
						
		else:
			print('Enter value in between 1 & 8')
	else:
		print('Check From and Upto Again.')
except Exception as e :
	print(e.message)
