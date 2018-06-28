import os
import time
import re
import sys

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
	p=re.compile('^\d{4}(cs|ec|ce|cm|me|ex|ee|it)\d{6}$')
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
				print("RecordAvailable")
			else:
				print("RecordUnavailable")
			
		else:
			print('Enter value in between 1 & 8')
	else:
		print('Check From and Upto Again.')
except Exception as e :
	print(e.message)
