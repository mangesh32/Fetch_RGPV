import os
import time
def check():
	os.system('CMD /C del recres.txt && cls')
	os.system('CMD /C python onRGPV.py 0103cs151070 0103cs151070 6 >> recres.txt')
	f=open('recres.txt','r')
	x=f.read()
	f.close()
	x=x.strip()
	print(x)
	if(x=="Found on RGPV"):
		os.system('CMD /C msg mg "Result aa gya!!!!"')
		os.system('CMD /C python main.py 0103cs151001 0103cs151180 6')
		print(time.ctime(),">>> Finally Found !!!")
		print("_________Stopped Execution__________")
	else:
		print(time.ctime(),">>> Not-Found ")
		print("......Sleeping for 15 minutes.......")
		time.sleep(900)
		check()

check()