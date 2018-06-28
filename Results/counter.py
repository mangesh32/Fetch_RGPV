from bs4 import BeautifulSoup
import re
import collections
f=open('Data/CLG-0103/Batch-2019/CS/Sem-5/0103cs151001.html','r')
# h=re.findall(r"[A-Z](\+*)<\/td>/g",f.read())
tempdict=collections.defaultdict(dict)

def safeget(dct, *keys):
    for key in keys:
        try:
            dct = dct[key]
        except KeyError:
            return 0
    return dct

soup = BeautifulSoup(f.read(), 'html.parser')
table=soup.find_all("td", {"style" : "width:25%;text-align:center"})
ls=list()
sb=list()
fin={}
for t in table:
	a=BeautifulSoup(str(t),'html.parser').get_text()
	subject=re.search(r"\w{3,}.*",str(a))
	if(subject):
		sb.append(subject.group(0))

	grade=re.search(r"^[A-Z](\+*)$",str(a),re.M)
	if(grade):
		ls.append(grade.group(0))

# print(ls)
# print(sb)
for i in range(len(ls)):
	# fin[sb[i]]=ls[i]
	# print(sb[i]+" : "+ls[i])
	tempdict[sb[i]][ls[i]]=safeget(tempdict,sb[i],ls[i])+1
for k,v in tempdict.items():
	print(str(k)+" : "+str(v))




