import subprocess

# getting meta data
meta_data = subprocess.check_output(['netsh', 'wlan', 'show', 'profiles'])

# decoding meta data
data = meta_data.decode('utf-8', errors="backslashreplace")

# splitting data by line by line
data = data.split('\n')

network_data = []
profiles = []

# traverse the data
for i in data:
	
	# find "Todos os Perfis de Usuários" in each item
	if "Todos os Perfis de Usu\\xa0rios" in i:
		# if found
		# split the item
		i = i.split(":")
		
		# item at index 1 will be the wifi name
		i = i[1]
		
		# formatting the name
		# first and last character is use less
		i = i[1:-1]
		
		# appending the wifi name in the list
		profiles.append(i)
		

network_data.append(profiles)
passwords = []

for i in profiles:
	try:
		# getting meta data with password using wifi name
		results = subprocess.check_output(['netsh', 'wlan', 'show', 'profile', i, 'key=clear'])

		# decoding and splitting data line by line
		results = results.decode('utf-8', errors="backslashreplace")
		results = results.split('\n')
		
		# finding password from the result list
		results = [b.split(":")[1][1:-1] for b in results if "Conte\\xa3do da Chave" in b]
		
		# if there is password it will print the pass word
		try:
			passwords.append(results[0])
		
		except IndexError:
			print("{:<30}| {:<}".format(i, ""))
			
	
			
	except subprocess.CalledProcessError:
		print("Encoding Error Occurred")


network_data.append(passwords)
print(network_data)
