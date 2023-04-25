output "network" {
  value = "${module.prod-vpc.network}"
}

output "subnet" {
  value = "${module.prod-vpc.subnet}"
}

output "firewall_rule" {
  value = "${module.prod-firewall.firewall_rule}"
}

output "instance_name" {
  value = "${module.prod-api.instance_name}"
}

output "external_ip" {
  value = "${module.prod-api.external_ip}"
}