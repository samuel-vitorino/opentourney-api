output "network" {
  value = "${module.dev-vpc.network}"
}

output "subnet" {
  value = "${module.dev-vpc.subnet}"
}

output "firewall_rule" {
  value = "${module.dev-firewall.firewall_rule}"
}

output "instance_name" {
  value = "${module.dev-api.instance_name}"
}

output "external_ip" {
  value = "${module.dev-api.external_ip}"
}