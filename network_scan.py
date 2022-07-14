import scapy.all as scapy
import socket as s
import netifaces


def get_args():
    gws = netifaces.gateways()
    gateway = gws['default'][netifaces.AF_INET][0]
    print(gateway)
    return f'{gateway}/24'


def scan(ip):
    arp_req_frame = scapy.ARP(pdst=ip)

    broadcast_ether_frame = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")

    broadcast_ether_arp_req_frame = broadcast_ether_frame / arp_req_frame

    answered_list = scapy.srp(broadcast_ether_arp_req_frame, timeout=1, verbose=False)[0]
    result = []
    for i in range(0, len(answered_list)):
        ip_address = answered_list[i][1].psrc
        mac_address = answered_list[i][1].hwsrc
        device = s.getfqdn(ip_address)

        if "<" in device:
            device = "Erro ao consultar detalhes"

        client_dict = {"ip": ip_address, "mac": mac_address, "device": device}
        result.append(client_dict)

    return result


def display_result(result):
    print(result)


options = get_args()
scanned_output = scan(options)
display_result(scanned_output)
