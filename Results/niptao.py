import os
f=open('Queue.txt','r')
text=f.read()
text=text.strip()
f.close()
f=open('Queue.txt','w+')
f.close()

# s={}
s=set(text.split('\n'))
cmd=' && '.join(list(s))
os.system('cmd /C '+cmd)
