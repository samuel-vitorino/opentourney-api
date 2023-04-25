output "network" {
  value = "${module.api-prod-vpc.network}"
}

output "subnet" {
  value = "${module.api-prod-vpc.subnet}"
}

output "firewall_rule" {
  value = "${module.api-prod-firewall.firewall_rule}"
}

output "instance_name" {
  value = "${module.api-prod-server.instance_name}"
}

output "external_ip" {
  value = "${module.api-prod-server.external_ip}"
}