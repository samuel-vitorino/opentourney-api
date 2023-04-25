output "network" {
  value = "${module.api-dev-vpc.network}"
}

output "subnet" {
  value = "${module.api-dev-vpc.subnet}"
}

output "firewall_rule" {
  value = "${module.api-dev-firewall.firewall_rule}"
}

output "instance_name" {
  value = "${module.api-dev-server.instance_name}"
}

output "external_ip" {
  value = "${module.api-dev-server.external_ip}"
}