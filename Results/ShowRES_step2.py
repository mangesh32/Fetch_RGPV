import requests
import os
import time
import re
import json
import sys
import threading
import collections
from bs4 import BeautifulSoup
DataSet=[]
tempdict=collections.defaultdict(dict)

def safeget(dct, *keys):
    for key in keys:
        try:
            dct = dct[key]
        except KeyError:
            return 0
    return dct

def ensure_dir(directory):
    # directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
def showRES(mylist,path):
	for rnum in mylist:
		if(os.access(path+'/'+rnum+'.html',os.R_OK)):
			f=open(path+'/'+rnum+'.html','r')
			t=f.read()
			soup = BeautifulSoup(t, 'html.parser')
			SGPA=soup.find(id="ctl00_ContentPlaceHolder1_lblSGPA").text
			CGPA=soup.find(id="ctl00_ContentPlaceHolder1_lblcgpa").text
			NAME=soup.find(id="ctl00_ContentPlaceHolder1_lblNameGrading").text
			STATUS=soup.find(id="ctl00_ContentPlaceHolder1_lblResultNewGrading").text

			table=soup.find_all("td", {"style" : "width:25%;text-align:center"})
			ls=list()
			sb=list()
			fin={}
			for t in table:
				a=BeautifulSoup(str(t),'html.parser').get_text()
				subject=re.search(r"\w{2}\d{3,}.*",str(a))
				if(subject):
					sb.append(subject.group(0))

				grade=re.search(r"^[A-F](\+*)(##)*$|^F \(ABS\)$",str(a),re.M)
				if(grade):
					ls.append(grade.group(0))

			# print(ls)
			# print(sb)
			for i in range(len(ls)):
				# fin[sb[i]]=ls[i]
				tempdict[sb[i]][ls[i]]=safeget(tempdict,sb[i],ls[i])+1


			# print(rnum+": SGPA> "+SGPA+" : CGPA> "+CGPA+" : "+NAME.ljust(20)+" : "+STATUS)
			a={'ID':rnum,'NAME':NAME,'SGPA':SGPA,'CGPA':CGPA,'STATUS':STATUS,'GRADES':ls}
			# a.update(fin)
			DataSet.append(a)
			# DataSet
		else:
			# print(rnum+": "+"-"*22+"NOT-FOUND"+"-"*22)
			DataSet.append({'ID':rnum,'NAME':'--','SGPA':'0.00','CGPA':'0.00','STATUS':'NOT-FOUND','GRADES':None})

def export_Xcel():
	# DataSet.append(tempdict.keys())
	subs=list(x for x in tempdict.keys())
	print("SUBJECTS:"+str(subs))

	attainment={k:v for k,v in tempdict.items()}
	print("ATTAINMENT:"+str(json.dumps(attainment,separators=(',',':'))))
	# print(tempdict)
	jsonData=json.dumps(DataSet,separators=(',',':'))
	print("DATA:"+str(jsonData))
	


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

	

#.....MAIN ...............
try:
	args=sys.argv
	
	mylist=fetch_list(args[1],args[2])
	if mylist:
		sem=args[3]
		if int(sem) in range(1,9):
			path='Data/CLG-'+str(mylist[0][0:4])+'/Batch-20'+str(int(mylist[0][6:8])+4)+'/'+str(mylist[0][4:6]).upper()+'/Sem-'+sem
			ensure_dir(path)
			if os.access(path+'/Fetch_Details.txt',os.R_OK):
				showRES(mylist,path)		
				export_Xcel()
			
		else:
			print('Enter value in between 1 & 8')
	else:
		print('Check From and Upto Again.')
except Exception as e :
	print(e.message)
