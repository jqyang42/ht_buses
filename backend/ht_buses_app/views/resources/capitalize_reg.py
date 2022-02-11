def convert_to_cap(m):
    """Convert the second group to uppercase and join both group 1 & group 2"""
    return m.group(1) + m.group(2).upper()

