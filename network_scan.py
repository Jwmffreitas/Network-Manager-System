import sys

import scapy.all as scapy
import argparse
import requests
import socket as s


def get_args():
    #parser = argparse.ArgumentParser()
    #parser.add_argument('-t', '--target', dest='target', help='Target IP Address/Adresses (Ex. 192.168.1.1/24)')
    #options = parser.parse_args()

    # Verifica se o usuário não especificou o endereço IP
    # Saia do programa se estiver faltando argumento
    # Enquanto sai, exiba a mensagem de erro
    #if not options.target:
        # Execute caso a interface não tenha sido especificada
    #    parser.error("[-] Por favor especifique um Endereço IP ou Endereço de Rede, use --help para mais informações.")
    return "192.168.10.0/24"


def scan(ip):
    arp_req_frame = scapy.ARP(pdst=ip)

    broadcast_ether_frame = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")

    broadcast_ether_arp_req_frame = broadcast_ether_frame / arp_req_frame

    answered_list = scapy.srp(broadcast_ether_arp_req_frame, timeout=1, verbose=False)[0]
    result = []
    for i in range(0, len(answered_list)):
        ip_address = answered_list[i][1].psrc
        mac_address = answered_list[i][1].hwsrc
        #short_mac = mac_address.replace(":", "")[:-2]
        #device = requests.get(f'https://macvendors.com/query/{short_mac}').text
        device = s.getfqdn(ip_address)

        if "<" in device:
            device = "Erro ao consultar detalhes"

        client_dict = {"ip": ip_address, "mac": mac_address, "device": device}
        result.append(client_dict)

    return result


def display_result(result):
    print(result)
    #print("---------------------------------------------------\nIP Address\tMAC Address\tDevice "
    #      "Details\n---------------------------------------------------")
    #for i in result:
    #    print("{}\t{}\t{}".format(i["ip"], i["mac"], i["device"]))


options = get_args()
scanned_output = scan(options)
display_result(scanned_output)
